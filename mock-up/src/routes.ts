import { createBrowserRouter } from "react-router";
import { Root } from "./components/Root";
import { SocialFeed } from "./components/SocialFeed";
import { Explore } from "./components/Explore";
import { EventDetails } from "./components/EventDetails";
import { PlanEvent } from "./components/PlanEvent";
import { Messages } from "./components/Messages";
import { MessageThread } from "./components/MessageThread";
import { PostEvent } from "./components/PostEvent";
import { CreatePost } from "./components/CreatePost";
import { Profile } from "./components/Profile";
import { EventJournal } from "./components/EventJournal";
import { AddJournalEntry } from "./components/AddJournalEntry";
import { JournalEntryDetail } from "./components/JournalEntryDetail";
import { Settings } from "./components/Settings";
import { EditProfile } from "./components/EditProfile";
import { FriendsList } from "./components/FriendsList";
import { VenueProfile } from "./components/VenueProfile";
import { Navigate } from "react-router";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Root,
    children: [
      { index: true, Component: SocialFeed },
      { path: "explore", Component: Explore },
      { path: "event/:id", Component: EventDetails },
      { path: "venue/:id", Component: VenueProfile },
      { path: "plan", Component: PlanEvent },
      { path: "messages", Component: Messages },
      { path: "messages/:id", Component: MessageThread },
      { path: "post-event/:id", Component: PostEvent },
      { path: "post", Component: CreatePost },
      { path: "profile", Component: Profile },
      { path: "profile/edit", Component: EditProfile },
      { path: "profile/friends", Component: FriendsList },
      { path: "journal", Component: EventJournal },
      { path: "journal/add", Component: AddJournalEntry },
      { path: "journal/:id", Component: JournalEntryDetail },
      { path: "settings", Component: Settings },
      { path: "*", element: <Navigate to="/" replace /> },
    ],
  },
]);