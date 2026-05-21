import { useState, useEffect, useRef } from 'react';
import {
  View, Text, Pressable, FlatList, Image, StyleSheet,
  Dimensions, PanResponder, Animated, ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { X, Copy, Camera } from 'lucide-react-native';
import * as MediaLibrary from 'expo-media-library';
import * as ImagePicker from 'expo-image-picker';
import { Colors } from '@/constants/Colors';

const { width: SW } = Dimensions.get('window');
const THUMB = Math.floor((SW - 2) / 3);
const MAX_SELECT = 10;

type Asset = MediaLibrary.Asset;

// ─── Pinch-scale tracking ─────────────────────────────────────────────────────

function distance(touches: { pageX: number; pageY: number }[]) {
  const dx = touches[0].pageX - touches[1].pageX;
  const dy = touches[0].pageY - touches[1].pageY;
  return Math.sqrt(dx * dx + dy * dy);
}

// ─── Screen ───────────────────────────────────────────────────────────────────

export default function NewPostScreen() {
  const [mlPerm, requestMlPerm] = MediaLibrary.usePermissions();
  const [assets, setAssets]     = useState<Asset[]>([]);
  const [cursor, setCursor]     = useState<string | undefined>();
  const [hasMore, setHasMore]   = useState(true);
  const [fetching, setFetching] = useState(false);

  const [preview, setPreview] = useState<Asset | null>(null);
  const [multi, setMulti]     = useState(false);
  const [picks, setPicks]     = useState<Asset[]>([]);
  const [tab, setTab]         = useState<'recents' | 'camera'>('recents');

  // ── Pan (reposition) ──
  const panOffset = useRef({ x: 0, y: 0 });
  const panAnim   = useRef(new Animated.ValueXY()).current;

  // ── Pinch-to-zoom via raw touch events ──
  const scaleAnim     = useRef(new Animated.Value(1)).current;
  const baseScale     = useRef(1);
  const pinchStartDist = useRef(0);

  const pr = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder:    () => true,
      onMoveShouldSetPanResponder:     () => true,
      onPanResponderGrant() {
        panAnim.setOffset(panOffset.current);
        panAnim.setValue({ x: 0, y: 0 });
      },
      onPanResponderMove(evt, g) {
        const touches = evt.nativeEvent.touches;
        if (touches.length === 2) {
          // Pinch
          const d = distance(touches as any);
          if (pinchStartDist.current === 0) pinchStartDist.current = d;
          const ratio = d / pinchStartDist.current;
          const next  = Math.min(Math.max(baseScale.current * ratio, 1), 3);
          scaleAnim.setValue(next);
        } else {
          // Pan
          panAnim.x.setValue(g.dx);
          panAnim.y.setValue(g.dy);
        }
      },
      onPanResponderRelease(_, g) {
        const touches = _.nativeEvent.touches;
        if (touches.length < 2) {
          panOffset.current = {
            x: panOffset.current.x + g.dx,
            y: panOffset.current.y + g.dy,
          };
          panAnim.flattenOffset();
        }
        baseScale.current = (scaleAnim as any)._value;
        pinchStartDist.current = 0;
      },
    })
  ).current;

  useEffect(() => {
    panOffset.current = { x: 0, y: 0 };
    panAnim.setValue({ x: 0, y: 0 });
    baseScale.current = 1;
    scaleAnim.setValue(1);
  }, [preview?.id]);

  useEffect(() => {
    if (mlPerm?.granted) load();
  }, [mlPerm?.granted]);

  async function load(after?: string) {
    if (fetching) return;
    setFetching(true);
    try {
      const res = await MediaLibrary.getAssetsAsync({
        first:     60,
        after,
        mediaType: [MediaLibrary.MediaType.photo, MediaLibrary.MediaType.video],
        sortBy:    [[MediaLibrary.SortBy.creationTime, false]],
      });
      setAssets(prev => after ? [...prev, ...res.assets] : res.assets);
      setHasMore(res.hasNextPage);
      setCursor(res.endCursor);
      if (!after && !preview && res.assets.length > 0) setPreview(res.assets[0]);
    } finally {
      setFetching(false);
    }
  }

  function tapThumb(asset: Asset) {
    setPreview(asset);
    if (!multi) return;
    setPicks(prev => {
      const idx = prev.findIndex(a => a.id === asset.id);
      if (idx >= 0) return prev.filter(a => a.id !== asset.id);
      if (prev.length >= MAX_SELECT) return prev;
      return [...prev, asset];
    });
  }

  function toggleMulti() {
    if (multi) {
      setPicks([]);
      setMulti(false);
    } else {
      setPicks(preview ? [preview] : []);
      setMulti(true);
    }
  }

  async function switchToCamera() {
    setTab('camera');
    const { granted } = await ImagePicker.requestCameraPermissionsAsync();
    if (!granted) { setTab('recents'); return; }
    const res = await ImagePicker.launchCameraAsync({
      mediaTypes: ['images', 'videos'],
      allowsEditing: false,
    });
    setTab('recents');
    if (!res.canceled) load();
  }

  function goNext() {
    const media = multi ? picks : (preview ? [preview] : []);
    if (!media.length) return;
    router.push({
      pathname: '/post-details',
      params: { uris: media.map(a => a.uri).join('|||') },
    });
  }

  const canNext = multi ? picks.length > 0 : !!preview;

  // ── Permission gate ──
  if (!mlPerm) return <View style={s.root} />;

  if (!mlPerm.granted) {
    return (
      <SafeAreaView style={s.root} edges={['top']}>
        <View style={s.permScreen}>
          <Camera size={48} strokeWidth={1.5} color={Colors.naturalGrey} />
          <Text style={s.permTitle}>Allow Photo Access</Text>
          <Text style={s.permBody}>
            Blyss needs access to your photo library to create posts.
          </Text>
          <Pressable style={s.permBtn} onPress={requestMlPerm}>
            <Text style={s.permBtnTxt}>Allow Access</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={s.root} edges={['top']}>

      {/* ── Header ── */}
      <View style={s.header}>
        <Pressable onPress={() => router.back()} hitSlop={10} style={s.hBtn}>
          <X size={22} strokeWidth={2} color={Colors.black} />
        </Pressable>
        <Text style={s.hTitle}>New Post</Text>
        <Pressable onPress={canNext ? goNext : undefined} hitSlop={10} style={s.hBtn}>
          <Text style={[s.hNext, canNext && s.hNextOn]}>Next</Text>
        </Pressable>
      </View>

      {/* ── Preview (square, pan + pinch) ── */}
      <View style={s.preview} {...pr.panHandlers}>
        {preview ? (
          <Animated.Image
            source={{ uri: preview.uri }}
            style={[
              s.previewImg,
              {
                transform: [
                  { translateX: panAnim.x },
                  { translateY: panAnim.y },
                  { scale: scaleAnim },
                ],
              },
            ]}
            resizeMode="cover"
          />
        ) : (
          <View style={s.previewEmpty}>
            {fetching && <ActivityIndicator color={Colors.primaryBlue} />}
          </View>
        )}
      </View>

      {/* ── Grid section ── */}
      <View style={s.gridWrap}>

        {/* Tab row */}
        <View style={s.tabRow}>
          <Pressable onPress={() => setTab('recents')} style={s.tabItem}>
            <Text style={[s.tabTxt, tab === 'recents' && s.tabTxtOn]}>Recents</Text>
            {tab === 'recents' && <View style={s.tabLine} />}
          </Pressable>
          <Pressable onPress={switchToCamera} style={s.tabItem}>
            <Text style={[s.tabTxt, tab === 'camera' && s.tabTxtOn]}>Camera</Text>
            {tab === 'camera' && <View style={s.tabLine} />}
          </Pressable>
          <View style={{ flex: 1 }} />
          {/* Multi-select toggle */}
          <Pressable onPress={toggleMulti} style={[s.multiBtn, multi && s.multiBtnOn]}>
            <Copy size={16} strokeWidth={2.2} color={multi ? Colors.white : Colors.black} />
          </Pressable>
        </View>

        {/* Photo grid */}
        <FlatList<Asset>
          data={assets}
          numColumns={3}
          keyExtractor={a => a.id}
          columnWrapperStyle={{ gap: 1 }}
          ItemSeparatorComponent={() => <View style={{ height: 1 }} />}
          showsVerticalScrollIndicator={false}
          onEndReached={() => { if (hasMore && !fetching) load(cursor); }}
          onEndReachedThreshold={0.5}
          renderItem={({ item }) => {
            const pickIdx    = picks.findIndex(a => a.id === item.id);
            const isSingle   = !multi && item.id === preview?.id;
            const isPicked   = multi && pickIdx >= 0;
            const isUnpicked = multi && !isPicked;

            return (
              <Pressable
                onPress={() => tapThumb(item)}
                style={[s.thumb, { width: THUMB, height: THUMB }]}
              >
                <Image
                  source={{ uri: item.uri }}
                  style={StyleSheet.absoluteFillObject}
                  resizeMode="cover"
                />

                {/* Single-select: white checkmark badge */}
                {isSingle && (
                  <View style={s.singBadge}>
                    <Text style={s.singBadgeTxt}>✓</Text>
                  </View>
                )}

                {/* Multi: dim overlay + numbered badge */}
                {isPicked && <View style={s.mulOverlay} />}
                {isPicked && (
                  <View style={s.badge}>
                    <Text style={s.badgeTxt}>{pickIdx + 1}</Text>
                  </View>
                )}

                {/* Multi: empty selection ring on unselected thumbnails */}
                {isUnpicked && <View style={s.emptyRing} />}
              </Pressable>
            );
          }}
          ListFooterComponent={
            fetching
              ? <ActivityIndicator style={s.loader} color={Colors.primaryBlue} />
              : null
          }
        />
      </View>

    </SafeAreaView>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.screenBackground },

  // Permission screen
  permScreen: {
    flex: 1, alignItems: 'center', justifyContent: 'center',
    paddingHorizontal: 40, gap: 16,
  },
  permTitle:  { fontSize: 18, fontWeight: '700', color: Colors.black, textAlign: 'center' },
  permBody:   { fontSize: 14, color: Colors.naturalGrey, textAlign: 'center', lineHeight: 20 },
  permBtn:    {
    backgroundColor: Colors.primaryBlue, borderRadius: 12,
    paddingVertical: 12, paddingHorizontal: 28, marginTop: 4,
  },
  permBtnTxt: { fontSize: 15, fontWeight: '700', color: Colors.white },

  // Header
  header: {
    flexDirection: 'row', alignItems: 'center', height: 48,
    paddingHorizontal: 4,
    borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: Colors.divider,
  },
  hBtn:    { width: 60, height: 48, alignItems: 'center', justifyContent: 'center' },
  hTitle:  { flex: 1, textAlign: 'center', fontSize: 16, fontWeight: '700', color: Colors.black },
  hNext:   { fontSize: 16, fontWeight: '600', color: Colors.naturalGrey },
  hNextOn: { color: Colors.primaryBlue },

  // Preview
  preview:      { width: SW, height: SW, backgroundColor: '#111', overflow: 'hidden' },
  previewImg:   { width: SW, height: SW, position: 'absolute' },
  previewEmpty: { flex: 1, alignItems: 'center', justifyContent: 'center' },

  // Grid section
  gridWrap: { flex: 1, backgroundColor: '#111' },

  tabRow: {
    flexDirection: 'row', alignItems: 'center', height: 44,
    paddingHorizontal: 12, backgroundColor: Colors.screenBackground,
    borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: Colors.divider,
  },
  tabItem:   { paddingHorizontal: 6, height: 44, justifyContent: 'center', position: 'relative' },
  tabTxt:    { fontSize: 14, fontWeight: '600', color: Colors.naturalGrey },
  tabTxtOn:  { color: Colors.black },
  tabLine:   {
    position: 'absolute', bottom: 0, left: 6, right: 6,
    height: 2, borderRadius: 1, backgroundColor: Colors.black,
  },
  multiBtn:   {
    width: 34, height: 34, borderRadius: 8,
    backgroundColor: Colors.lightGrey,
    alignItems: 'center', justifyContent: 'center',
  },
  multiBtnOn: { backgroundColor: Colors.primaryBlue },

  // Thumbnails
  thumb: { overflow: 'hidden', position: 'relative' },

  singBadge: {
    position: 'absolute', top: 6, right: 6,
    width: 24, height: 24, borderRadius: 12,
    backgroundColor: Colors.white,
    alignItems: 'center', justifyContent: 'center',
    shadowColor: '#000', shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.15, shadowRadius: 2,
  },
  singBadgeTxt: { fontSize: 13, fontWeight: '700', color: Colors.primaryBlue, lineHeight: 16 },
  mulOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.28)',
  },
  badge: {
    position: 'absolute', top: 6, right: 6,
    width: 24, height: 24, borderRadius: 12,
    backgroundColor: Colors.primaryBlue,
    alignItems: 'center', justifyContent: 'center',
    borderWidth: 1.5, borderColor: Colors.white,
  },
  badgeTxt:  { fontSize: 11, fontWeight: '700', color: Colors.white },
  emptyRing: {
    position: 'absolute', top: 6, right: 6,
    width: 22, height: 22, borderRadius: 11,
    borderWidth: 2, borderColor: Colors.white,
    backgroundColor: 'rgba(0,0,0,0.15)',
  },
  loader: { paddingVertical: 12 },
});
