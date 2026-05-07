function Paragraph() {
  return (
    <div className="h-[23.994px] relative shrink-0 w-full" data-name="Paragraph">
      <p className="-translate-x-1/2 absolute font-['Figtree:SemiBold',sans-serif] font-semibold leading-[24px] left-[48.18px] text-[#333] text-[16px] text-center top-[-0.79px]">87</p>
    </div>
  );
}

function Paragraph1() {
  return (
    <div className="h-[15.996px] relative shrink-0 w-full" data-name="Paragraph">
      <p className="-translate-x-1/2 absolute font-['Figtree:Regular',sans-serif] font-normal leading-[16px] left-[48.19px] text-[#8b8f94] text-[12px] text-center top-[-0.26px]">Events</p>
    </div>
  );
}

function Container1() {
  return (
    <div className="absolute content-stretch flex flex-col h-[39.991px] items-start left-[16px] top-[16px] w-[95.954px]" data-name="Container">
      <Paragraph />
      <Paragraph1 />
    </div>
  );
}

function Paragraph2() {
  return (
    <div className="h-[23.994px] relative shrink-0 w-full" data-name="Paragraph">
      <p className="-translate-x-1/2 absolute font-['Figtree:SemiBold',sans-serif] font-semibold leading-[24px] left-[48.38px] text-[#333] text-[16px] text-center top-[-0.79px]">42</p>
    </div>
  );
}

function Paragraph3() {
  return (
    <div className="h-[15.996px] relative shrink-0 w-full" data-name="Paragraph">
      <p className="-translate-x-1/2 absolute font-['Figtree:Regular',sans-serif] font-normal leading-[16px] left-[48.01px] text-[#8b8f94] text-[12px] text-center top-[-0.26px]">Venues</p>
    </div>
  );
}

function Container2() {
  return (
    <div className="absolute content-stretch flex flex-col h-[39.991px] items-start left-[127.95px] top-[16px] w-[95.954px]" data-name="Container">
      <Paragraph2 />
      <Paragraph3 />
    </div>
  );
}

function Paragraph4() {
  return (
    <div className="h-[23.994px] relative shrink-0 w-full" data-name="Paragraph">
      <p className="-translate-x-1/2 absolute font-['Figtree:SemiBold',sans-serif] font-semibold leading-[24px] left-[47.99px] text-[#333] text-[16px] text-center top-[-0.79px]">4.6</p>
    </div>
  );
}

function Paragraph5() {
  return (
    <div className="h-[15.996px] relative shrink-0 w-full" data-name="Paragraph">
      <p className="-translate-x-1/2 absolute font-['Figtree:Regular',sans-serif] font-normal leading-[16px] left-[48.1px] text-[#8b8f94] text-[12px] text-center top-[-0.26px]">Avg Rating</p>
    </div>
  );
}

function Container3() {
  return (
    <div className="absolute content-stretch flex flex-col h-[39.991px] items-start left-[239.9px] top-[16px] w-[95.954px]" data-name="Container">
      <Paragraph4 />
      <Paragraph5 />
    </div>
  );
}

export default function Container() {
  return (
    <div className="bg-white border-[#e3e4e6] border-[0.737px] border-solid relative rounded-[16px] size-full" data-name="Container">
      <Container1 />
      <Container2 />
      <Container3 />
    </div>
  );
}