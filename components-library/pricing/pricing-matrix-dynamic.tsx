import * as React from 'react';

export interface PricingFeature {
  text?: string;
  icon?: React.ReactNode;
}

export interface PricingCard {
  planName?: string;
  price?: string;
  pricePeriod?: string;
  description?: string;
  buttonText?: string;
  isFeatured?: boolean;
  features?: PricingFeature[];
}

export interface PricingMatrixDynamicProps {
  title?: string;
  description?: string;
  featuresHeader?: string;
  cards?: PricingCard[];
}

export function PricingMatrixDynamic({
  title,
  description,
  featuresHeader,
  cards,
}: PricingMatrixDynamicProps) {
  return (
    <div
      style={{ fontFamily: "'Roboto', sans-serif" }}
      className="w-full bg-white text-stone-900 py-16 md:py-24 px-4 sm:px-6 lg:px-8"
    >
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Roboto:wght@300;500&display=swap');`}</style>
      
      <div className="max-w-6xl mx-auto">
        {/* Header Section */}
        {(title || description) && (
          <div className="text-center mb-16 md:mb-20 max-w-3xl mx-auto">
            {title && (
              <h2
                style={{ fontWeight: 500 }}
                className="text-4xl md:text-5xl lg:text-6xl text-stone-900 tracking-tight leading-tight mb-6"
              >
                {title}
              </h2>
            )}
            {description && (
              <p
                style={{ fontWeight: 300 }}
                className="text-stone-500 text-lg md:text-xl leading-relaxed"
              >
                {description}
              </p>
            )}
          </div>
        )}

        {/* Pricing Cards Grid */}
        {cards && cards.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
            {cards.map((card, idx) => {
              if (!card) return null;
              const isDark = !!card.isFeatured;

              return (
                <div
                  key={idx}
                  className={`flex flex-col justify-between rounded-3xl p-8 md:p-10 transition-all duration-300 ${
                    isDark
                      ? 'bg-[#111111] text-white shadow-xl'
                      : 'bg-[#fafaf9] border border-stone-100 hover:border-stone-200'
                  }`}
                >
                  <div>
                    {/* Plan Title */}
                    {card.planName && (
                      <h3
                        style={{ fontWeight: 500 }}
                        className={`text-xl md:text-2xl mb-4 ${
                          isDark ? 'text-stone-300' : 'text-stone-600'
                        }`}
                      >
                        {card.planName}
                      </h3>
                    )}

                    {/* Pricing */}
                    {(card.price || card.pricePeriod) && (
                      <div className="flex items-baseline gap-2 mb-6">
                        {card.price && (
                          <span
                            style={{ fontWeight: 500 }}
                            className={`text-4xl md:text-5xl lg:text-6xl tracking-tight ${
                              isDark ? 'text-white' : 'text-stone-900'
                            }`}
                          >
                            {card.price}
                          </span>
                        )}
                        {card.pricePeriod && (
                          <span
                            style={{ fontWeight: 300 }}
                            className={`text-base md:text-lg ${
                              isDark ? 'text-stone-400' : 'text-stone-500'
                            }`}
                          >
                            {card.pricePeriod}
                          </span>
                        )}
                      </div>
                    )}

                    {/* Plan Description */}
                    {card.description && (
                      <p
                        style={{ fontWeight: 300 }}
                        className={`text-sm md:text-base leading-relaxed mb-8 ${
                          isDark ? 'text-stone-400' : 'text-stone-500'
                        }`}
                      >
                        {card.description}
                      </p>
                    )}

                    {/* Features Section */}
                    {card.features && card.features.length > 0 && (
                      <div className="mb-8">
                        {featuresHeader && (
                          <h4
                            style={{ fontWeight: 500 }}
                            className={`text-xs uppercase tracking-wider mb-4 ${
                              isDark ? 'text-stone-400' : 'text-stone-500'
                            }`}
                          >
                            {featuresHeader}
                          </h4>
                        )}
                        <ul className="space-y-3">
                          {card.features.map((feature, fIdx) => {
                            if (!feature) return null;
                            return (
                              <li
                                key={fIdx}
                                className="flex items-start gap-3"
                              >
                                {feature.icon && (
                                  <span className="flex-shrink-0 mt-0.5">
                                    {feature.icon}
                                  </span>
                                )}
                                {feature.text && (
                                  <span
                                    style={{ fontWeight: 300 }}
                                    className={`text-sm md:text-base leading-snug ${
                                      isDark ? 'text-stone-300' : 'text-stone-700'
                                    }`}
                                  >
                                    {feature.text}
                                  </span>
                                )}
                              </li>
                            );
                          })}
                        </ul>
                      </div>
                    )}
                  </div>

                  {/* CTA Button */}
                  {card.buttonText && (
                    <div className="mt-8">
                      <button
                        type="button"
                        style={{ fontWeight: 300 }}
                        className={`w-full py-4 px-6 rounded-2xl text-center text-base transition-all duration-200 cursor-pointer ${
                          isDark
                            ? 'bg-white text-[#111111] hover:bg-stone-100 focus:ring-2 focus:ring-white/20'
                            : 'bg-[#111111] text-white hover:bg-stone-800 focus:ring-2 focus:ring-stone-900/20'
                        }`}
                      >
                        {card.buttonText}
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default PricingMatrixDynamic;