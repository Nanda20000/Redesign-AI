import React from 'react';

export interface AssetItem {
  name?: string;
  price?: string;
  iconUrl?: string;
}

export interface HeroBeamDynamicProps {
  title?: string;
  description?: string;
  primaryCtaText?: string;
  primaryCtaLink?: string;
  statValue?: string;
  statBadge?: string;
  chartPath?: string;
  cardOneTitle?: string;
  cardTwoTitle?: string;
  assetItems?: AssetItem[];
  cardThreeTitle?: string;
  avatarImages?: string[];
  cardThreeCtaText?: string;
  cardThreeCtaLink?: string;
}

export function HeroBeamDynamic({
  title,
  description,
  primaryCtaText,
  primaryCtaLink,
  statValue,
  statBadge,
  chartPath,
  cardOneTitle,
  cardTwoTitle,
  assetItems,
  cardThreeTitle,
  avatarImages,
  cardThreeCtaText,
  cardThreeCtaLink,
}: HeroBeamDynamicProps) {
  const lastChartPoint = React.useMemo(() => {
    if (!chartPath) return null;
    const matches = chartPath.match(/([-\d.]+)[,\s]+([-\d.]+)\s*$/);
    if (matches && matches[1] && matches[2]) {
      return { x: parseFloat(matches[1]), y: parseFloat(matches[2]) };
    }
    return null;
  }, [chartPath]);

  return (
    <section
      className="w-full bg-white py-12 md:py-20 px-4 sm:px-6 lg:px-8 overflow-hidden"
      style={{ fontFamily: "'Roboto', sans-serif" }}
    >
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Roboto:wght@300;500;700&display=swap');`}</style>

      {/* Main Container */}
      <div className="max-w-6xl mx-auto flex flex-col items-center">
        {/* Top Header Section */}
        <div className="max-w-4xl text-center mb-10 md:mb-14">
          {title ? (
            <h1
              style={{ fontWeight: 700 }}
              className="text-5xl sm:text-6xl md:text-7xl lg:text-[76px] text-slate-900 tracking-tight leading-[1.06]"
            >
              {title}
            </h1>
          ) : null}

          {description ? (
            <p
              style={{ fontWeight: 300 }}
              className="mt-4 sm:mt-6 text-base sm:text-lg md:text-xl text-slate-600 max-w-xl mx-auto leading-relaxed"
            >
              {description}
            </p>
          ) : null}

          {primaryCtaText ? (
            <div className="mt-6 sm:mt-8 flex justify-center">
              <a
                href={primaryCtaLink || '#'}
                style={{ fontWeight: 300 }}
                className="inline-flex items-center justify-center bg-[#0e121e] text-white px-7 py-3 rounded-xl text-sm sm:text-base hover:bg-slate-800 transition-colors shadow-sm"
              >
                {primaryCtaText}
              </a>
            </div>
          ) : null}
        </div>

        {/* 3 Interactive Hero Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5 sm:gap-3 w-full items-stretch">
          {/* Card 1: Orange Stat & Chart Card */}
          <div className="relative bg-[#ff5a1f] rounded-3xl p-6 sm:p-7 flex flex-col justify-between overflow-hidden min-h-[310px] shadow-sm">
            {/* Subtle decorative concentric rings in top-right corner */}
            <div className="absolute top-0 right-0 w-36 h-36 pointer-events-none overflow-hidden rounded-tr-3xl">
              <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full border-[16px] border-orange-400/35" />
              <div className="absolute -top-4 -right-4 w-28 h-28 rounded-full border-[12px] border-orange-400/25" />
            </div>

            {/* Stat Row */}
            <div className="relative z-10">
              <div className="flex items-baseline gap-2.5">
                {statValue ? (
                  <span
                    style={{ fontWeight: 300 }}
                    className="text-3xl sm:text-4xl text-slate-950 tracking-tight"
                  >
                    {statValue}
                  </span>
                ) : null}
                {statBadge ? (
                  <span
                    style={{ fontWeight: 300 }}
                    className="text-sm sm:text-base text-slate-900"
                  >
                    {statBadge}
                  </span>
                ) : null}
              </div>

              {/* Sparkline Chart */}
              {chartPath ? (
                <div className="w-full my-5 sm:my-7">
                  <svg
                    className="w-full h-16 sm:h-20 overflow-visible"
                    viewBox="0 0 300 80"
                    fill="none"
                  >
                    <path
                      d={chartPath}
                      stroke="#0e121e"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      fill="none"
                    />
                    {lastChartPoint ? (
                      <circle
                        cx={lastChartPoint.x}
                        cy={lastChartPoint.y}
                        r="4"
                        fill="#0e121e"
                      />
                    ) : null}
                  </svg>
                </div>
              ) : null}
            </div>

            {/* Card One Headline */}
            {cardOneTitle ? (
              <h3
                style={{ fontWeight: 500 }}
                className="relative z-10 text-2xl sm:text-3xl text-slate-950 leading-tight tracking-tight mt-auto"
              >
                {cardOneTitle}
              </h3>
            ) : null}
          </div>

          {/* Card 2: Dark Portfolio Asset Card */}
          <div className="relative bg-[#0e121e] rounded-3xl p-6 sm:p-7 flex flex-col justify-between min-h-[310px] shadow-sm">
            {/* Card Two Headline */}
            {cardTwoTitle ? (
              <h3
                style={{ fontWeight: 500 }}
                className="text-2xl sm:text-3xl text-white leading-tight tracking-tight"
              >
                {cardTwoTitle}
              </h3>
            ) : null}

            {/* Asset Items Pills */}
            {assetItems && assetItems.length > 0 ? (
              <div className="flex flex-wrap items-center gap-2.5 sm:gap-3 mt-8">
                {assetItems.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-2.5 bg-[#f4f3f0] rounded-full py-2 px-3.5 shadow-sm"
                  >
                    {item.iconUrl ? (
                      <img
                        src={item.iconUrl}
                        alt={item.name || ''}
                        className="w-8 h-8 rounded-full object-contain bg-black p-1.5 flex-shrink-0"
                      />
                    ) : null}
                    <div className="flex flex-col">
                      {item.name ? (
                        <span
                          style={{ fontWeight: 300 }}
                          className="text-xs sm:text-sm text-slate-900 leading-tight"
                        >
                          {item.name}
                        </span>
                      ) : null}
                      {item.price ? (
                        <span
                          style={{ fontWeight: 300 }}
                          className="text-[11px] sm:text-xs text-slate-500 leading-tight"
                        >
                          {item.price}
                        </span>
                      ) : null}
                    </div>
                  </div>
                ))}
              </div>
            ) : null}
          </div>

          {/* Card 3: Yellow Community / Social Proof Card */}
          <div className="relative bg-[#f8be14] rounded-3xl p-6 sm:p-7 flex flex-col items-center text-center justify-between overflow-hidden min-h-[310px] shadow-sm">
            {/* Subtle decorative concentric rings in bottom-right corner */}
            <div className="absolute bottom-0 right-0 w-36 h-36 pointer-events-none overflow-hidden rounded-br-3xl">
              <div className="absolute -bottom-10 -right-10 w-40 h-40 rounded-full border-[18px] border-amber-600/20" />
              <div className="absolute -bottom-4 -right-4 w-28 h-28 rounded-full border-[12px] border-amber-600/15" />
            </div>

            {/* Card Three Headline */}
            {cardThreeTitle ? (
              <h3
                style={{ fontWeight: 500 }}
                className="relative z-10 text-2xl sm:text-3xl text-slate-900 leading-tight tracking-tight"
              >
                {cardThreeTitle}
              </h3>
            ) : null}

            {/* Avatars List */}
            {avatarImages && avatarImages.length > 0 ? (
              <div className="relative z-10 flex items-center justify-center -space-x-2 my-5 sm:my-6">
                {avatarImages.map((src, idx) =>
                  src ? (
                    <img
                      key={idx}
                      src={src}
                      alt=""
                      className="w-11 h-11 sm:w-12 sm:h-12 rounded-full border-2 border-[#f8be14] object-cover shadow-sm flex-shrink-0"
                    />
                  ) : null
                )}
              </div>
            ) : null}

            {/* Card Three CTA Button */}
            {cardThreeCtaText ? (
              <div className="relative z-10 flex justify-center mt-auto">
                <a
                  href={cardThreeCtaLink || '#'}
                  style={{ fontWeight: 300 }}
                  className="inline-flex items-center justify-center bg-white text-slate-900 rounded-full px-6 py-2.5 text-xs sm:text-sm hover:bg-slate-50 transition-colors shadow-sm"
                >
                  {cardThreeCtaText}
                </a>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
}

export default HeroBeamDynamic;
