import svgPaths from "./svg-qjdnbeopnb";
import imgImagePerfectSundayBrunch from "figma:asset/3ff45c05782032798733294319d693048bd73e72.png";

function ImagePerfectSundayBrunch() {
  return (
    <div className="relative shrink-0 size-[95.989px]" data-name="Image (Perfect Sunday brunch! 🥑)">
      <div aria-hidden="true" className="absolute bg-clip-padding border-0 border-[transparent] border-solid inset-0 pointer-events-none">
        <div className="absolute bg-[#e3e4e6] bg-clip-padding border-0 border-[transparent] border-solid inset-0" />
        <img alt="" className="absolute bg-clip-padding border-0 border-[transparent] border-solid max-w-none object-cover size-full" src={imgImagePerfectSundayBrunch} />
      </div>
    </div>
  );
}

function Icon() {
  return (
    <div className="relative shrink-0 size-[13.994px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 13.9938 13.9938">
        <g clipPath="url(#clip0_23_9135)" id="Icon">
          <path d={svgPaths.pc943100} id="Vector" stroke="var(--stroke-0, #5BA8D3)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16615" />
          <path d={svgPaths.p85e100} id="Vector_2" stroke="var(--stroke-0, #5BA8D3)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16615" />
        </g>
        <defs>
          <clipPath id="clip0_23_9135">
            <rect fill="white" height="13.9938" width="13.9938" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function Paragraph() {
  return (
    <div className="h-[20.001px] relative shrink-0 w-[84.412px]" data-name="Paragraph">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid overflow-clip relative rounded-[inherit] size-full">
        <p className="absolute font-['Figtree:Medium',sans-serif] font-medium leading-[20px] left-0 text-[#333] text-[14px] top-[-0.53px]">Café Lumière</p>
      </div>
    </div>
  );
}

function Container2() {
  return (
    <div className="h-[20.001px] relative shrink-0 w-[231.876px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[5.996px] items-center relative size-full">
        <Icon />
        <Paragraph />
      </div>
    </div>
  );
}

function Paragraph1() {
  return (
    <div className="h-[20.001px] relative shrink-0 w-[231.876px]" data-name="Paragraph">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid overflow-clip relative rounded-[inherit] size-full">
        <p className="absolute font-['Figtree:Regular',sans-serif] font-normal leading-[20px] left-0 text-[#333] text-[14px] top-[-0.53px]">Perfect Sunday brunch! 🥑</p>
      </div>
    </div>
  );
}

function Icon1() {
  return (
    <div className="relative shrink-0 size-[13.994px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 13.9938 13.9938">
        <g clipPath="url(#clip0_23_9132)" id="Icon">
          <path d={svgPaths.p3348f600} id="Vector" stroke="var(--stroke-0, #8B8F94)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16615" />
        </g>
        <defs>
          <clipPath id="clip0_23_9132">
            <rect fill="white" height="13.9938" width="13.9938" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function Text() {
  return (
    <div className="h-[20.001px] relative shrink-0 w-[16.79px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Figtree:SemiBold',sans-serif] font-semibold leading-[20px] left-0 text-[#8b8f94] text-[14px] top-[-0.53px]">42</p>
      </div>
    </div>
  );
}

function Container3() {
  return (
    <div className="h-[20.001px] relative shrink-0 w-[231.876px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[5.996px] items-center relative size-full">
        <Icon1 />
        <Text />
      </div>
    </div>
  );
}

function Container1() {
  return (
    <div className="flex-[1_0_0] h-[95.989px] min-h-px min-w-px relative" data-name="Container">
      <div className="flex flex-col justify-center size-full">
        <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col gap-[3.993px] items-start justify-center pl-[11.991px] relative size-full">
          <Container2 />
          <Paragraph1 />
          <Container3 />
        </div>
      </div>
    </div>
  );
}

export default function Container() {
  return (
    <div className="bg-white relative rounded-[16px] size-full" data-name="Container">
      <div className="content-stretch flex items-start overflow-clip p-[0.737px] relative rounded-[inherit] size-full">
        <ImagePerfectSundayBrunch />
        <Container1 />
      </div>
      <div aria-hidden="true" className="absolute border-[#e3e4e6] border-[0.737px] border-solid inset-0 pointer-events-none rounded-[16px]" />
    </div>
  );
}