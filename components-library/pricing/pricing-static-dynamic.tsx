import React from 'react';

export interface PricingPlan {
  id: string;
  title?: string;
  description?: string;
  monthlyPrice?: string;
  yearlyPrice?: string;
  pricePrefix?: string;
  priceSuffixMonthly?: string;
  priceSuffixYearly?: string;
  buttonText?: string;
  isFeatured?: boolean;
  features?: string[];
}

export interface PricingStaticDynamicProps {
  title?: string;
  subtitle?: string;
  toggleMonthlyLabel?: string;
  toggleYearlyLabel?: string;
  toggleSaveLabel?: string;
  plans?: PricingPlan[];
  checkIcon?: React.ReactNode;
  onSelectPlan?: (planId: string, billingPeriod: 'monthly' | 'yearly') => void;
}

export function PricingStaticDynamic({
  title,
  subtitle,
  toggleMonthlyLabel,
  toggleYearlyLabel,
  toggleSaveLabel,
  plans,
  checkIcon,
  onSelectPlan,
}: PricingStaticDynamicProps) {
  const [billingPeriod, setBillingPeriod] = React.useState<'monthly' | 'yearly'>('monthly');

  const showToggle = !!(toggleMonthlyLabel || toggleYearlyLabel);

  return (
    <section 
      style={{ fontFamily: "'Roboto', sans-serif" }} 
      className="w-full bg-[#f4f5f6] py-16 px-4 md:px-8 border-t border-b border-zinc-100"
    >
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Roboto:wght@300;500&display=swap');`}</style>
      
      <div className="max-w-6xl mx-auto flex flex-col items-center">
        {title && (
          <h2 
            style={{ fontWeight: 500 }} 
            className="text-4xl text-zinc-950 text-center tracking-tight mb-2"
          >
            {title}
          </h2>
        )}
        
        {subtitle && (
          <p 
            style={{ fontWeight: 300 }} 
            className="text-zinc-500 text-center text-base mb-8 max-w-lg"
          >
            {subtitle}
          </p>
        )}

        {showToggle && (
          <div className="flex items-center justify-center gap-4 mb-12">
            {toggleMonthlyLabel && (
              <span
                role="button"
                onClick={() => setBillingPeriod('monthly')}
                style={{ fontWeight: 300 }}
                className={`text-sm cursor-pointer select-none transition-colors duration-200 ${
                  billingPeriod === 'monthly' ? 'text-zinc-950' : 'text-zinc-400'
                }`}
              >
                {toggleMonthlyLabel}
              </span>
            )}

            <div
              role="button"
              onClick={() => setBillingPeriod((prev) => (prev === 'monthly' ? 'yearly' : 'monthly'))}
              className="w-12 h-6 bg-zinc-950 rounded-full p-1 flex items-center cursor-pointer transition-all duration-250"
            >
              <div
                className={`w-4 h-4 bg-white rounded-full transition-transform duration-200 ${
                  billingPeriod === 'yearly' ? 'translate-x-6' : 'translate-x-0'
                }`}
              />
            </div>

            <div className="flex items-center gap-2">
              {toggleYearlyLabel && (
                <span
                  role="button"
                  onClick={() => setBillingPeriod('yearly')}
                  style={{ fontWeight: 300 }}
                  className={`text-sm cursor-pointer select-none transition-colors duration-200 ${
                    billingPeriod === 'yearly' ? 'text-zinc-950' : 'text-zinc-400'
                  }`}
                >
                  {toggleYearlyLabel}
                </span>
              )}
              {toggleSaveLabel && (
                <span
                  style={{ fontWeight: 300 }}
                  className="bg-[#d2f34c] text-zinc-950 px-2.5 py-0.5 rounded-full text-xs tracking-wide"
                >
                  {toggleSaveLabel}
                </span>
              )}
            </div>
          </div>
        )}

        {plans && plans.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full items-stretch">
            {plans.map((plan) => {
              if (!plan) return null;

              const activePrice = billingPeriod === 'yearly' && plan.yearlyPrice ? plan.yearlyPrice : plan.monthlyPrice;
              const activeSuffix = billingPeriod === 'yearly' && plan.priceSuffixYearly ? plan.priceSuffixYearly : plan.priceSuffixMonthly;

              const handleButtonClick = () => {
                if (onSelectPlan) {
                  onSelectPlan(plan.id, billingPeriod);
                }
              };

              if (plan.isFeatured) {
                return (
                  <div 
                    key={plan.id}
                    className="bg-[#0c1313] text-white rounded-[2rem] border border-[#1a2626] p-4 flex flex-col justify-between shadow-2xl transition-all duration-300"
                  >
                    <div className="p-6 flex-1 flex flex-col">
                      {plan.title && (
                        <h3 
                          style={{ fontWeight: 500 }} 
                          className="text-white text-xl tracking-tight mb-1"
                        >
                          {plan.title}
                        </h3>
                      )}
                      
                      {plan.description && (
                        <p 
                          style={{ fontWeight: 300 }} 
                          className="text-zinc-400 text-sm mb-6"
                        >
                          {plan.description}
                        </p>
                      )}

                      {(activePrice || plan.pricePrefix) && (
                        <div className="flex items-baseline mb-6">
                          {plan.pricePrefix && (
                            <span 
                              style={{ fontWeight: 300 }} 
                              className="text-[#d2f34c] text-2xl align-super pr-1"
                            >
                              {plan.pricePrefix}
                            </span>
                          )}
                          {activePrice && (
                            <span 
                              style={{ fontWeight: 300 }} 
                              className="text-[#d2f34c] text-5xl leading-none"
                            >
                              {activePrice}
                            </span>
                          )}
                          {activeSuffix && (
                            <span 
                              style={{ fontWeight: 300 }} 
                              className="text-[#d2f34c] text-sm pl-1.5"
                            >
                              {activeSuffix}
                            </span>
                          )}
                        </div>
                      )}

                      {plan.buttonText && (
                        <button
                          onClick={handleButtonClick}
                          style={{ fontWeight: 300 }}
                          className="w-full py-3.5 bg-[#d2f34c] text-zinc-950 rounded-full hover:opacity-95 transition-opacity cursor-pointer text-sm tracking-wide mt-auto"
                        >
                          {plan.buttonText}
                        </button>
                      )}
                    </div>

                    {plan.features && plan.features.length > 0 && (
                      <div className="bg-white text-zinc-800 rounded-[1.5rem] p-6 mt-4">
                        <ul className="space-y-4">
                          {plan.features.map((feature, idx) => {
                            if (!feature) return null;
                            return (
                              <li key={idx} className="flex items-start gap-3">
                                {checkIcon && (
                                  <div className="mt-0.5 text-zinc-800 flex-shrink-0">
                                    {checkIcon}
                                  </div>
                                )}
                                <span style={{ fontWeight: 300 }} className="text-zinc-800 text-sm">
                                  {feature}
                                </span>
                              </li>
                            );
                          })}
                        </ul>
                      </div>
                    )}
                  </div>
                );
              }

              // Standard card (Basic / Premium)
              return (
                <div 
                  key={plan.id}
                  className="bg-white rounded-[2rem] border border-zinc-150 p-4 flex flex-col justify-between shadow-lg shadow-zinc-200/50 transition-all duration-300"
                >
                  <div className="p-6 flex-1 flex flex-col">
                    {plan.title && (
                      <h3 
                        style={{ fontWeight: 500 }} 
                        className="text-zinc-950 text-xl tracking-tight mb-1"
                      >
                        {plan.title}
                      </h3>
                    )}
                    
                    {plan.description && (
                      <p 
                        style={{ fontWeight: 300 }} 
                        className="text-zinc-500 text-sm mb-6"
                      >
                        {plan.description}
                      </p>
                    )}

                    {(activePrice || plan.pricePrefix) && (
                      <div className="flex items-baseline mb-6">
                        {plan.pricePrefix && (
                          <span 
                            style={{ fontWeight: 300 }} 
                            className="text-[#6366f1] text-2xl align-super pr-1"
                          >
                            {plan.pricePrefix}
                          </span>
                        )}
                        {activePrice && (
                          <span 
                            style={{ fontWeight: 300 }} 
                            className="text-zinc-950 text-5xl leading-none"
                          >
                            {activePrice}
                          </span>
                        )}
                        {activeSuffix && (
                          <span 
                            style={{ fontWeight: 300 }} 
                            className="text-zinc-500 text-sm pl-1.5"
                          >
                            {activeSuffix}
                          </span>
                        )}
                      </div>
                    )}

                    {plan.buttonText && (
                      <button
                        onClick={handleButtonClick}
                        style={{ fontWeight: 300 }}
                        className="w-full py-3.5 bg-white text-zinc-800 rounded-full border border-zinc-200 hover:bg-zinc-50 transition-colors cursor-pointer text-sm tracking-wide mt-auto"
                      >
                        {plan.buttonText}
                      </button>
                    )}
                  </div>

                  {plan.features && plan.features.length > 0 && (
                    <div className="bg-[#eaebeb] rounded-[1.5rem] p-6 mt-4">
                      <ul className="space-y-4">
                        {plan.features.map((feature, idx) => {
                          if (!feature) return null;
                          return (
                            <li key={idx} className="flex items-start gap-3">
                              {checkIcon && (
                                <div className="mt-0.5 text-zinc-600 flex-shrink-0">
                                  {checkIcon}
                                </div>
                              )}
                              <span style={{ fontWeight: 300 }} className="text-zinc-700 text-sm">
                                {feature}
                              </span>
                            </li>
                          );
                        })}
                      </ul>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}

export default PricingStaticDynamic;
