import React from 'react';

export interface ContactLinkDynamicProps {
  title?: string;
  description?: string;
  namePlaceholder?: string;
  emailPlaceholder?: string;
  messagePlaceholder?: string;
  buttonText?: string;
  imageUrl?: string;
}

export const ContactLinkDynamic = ({
  title,
  description,
  namePlaceholder,
  emailPlaceholder,
  messagePlaceholder,
  buttonText,
  imageUrl,
}: ContactLinkDynamicProps) => {
  return (
    <div
      style={{ fontFamily: "'Roboto', sans-serif" }}
      className="w-full max-w-5xl mx-auto p-6 md:p-12 bg-white rounded-3xl"
    >
      <style>
        {`@import url('https://fonts.googleapis.com/css2?family=Roboto:wght@300;500&display=swap');`}
      </style>
      <div className="flex flex-col md:flex-row gap-12">
        <div className="flex-1 flex flex-col justify-center gap-6">
          {title && (
            <h2 style={{ fontWeight: 500 }} className="text-4xl text-gray-900">
              {title}
            </h2>
          )}
          {description && (
            <p style={{ fontWeight: 300 }} className="text-lg text-gray-600">
              {description}
            </p>
          )}

          <div className="space-y-4">
            {namePlaceholder && (
              <input
                type="text"
                placeholder={namePlaceholder}
                style={{ fontWeight: 300 }}
                className="w-full p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-gray-900"
              />
            )}
            {emailPlaceholder && (
              <input
                type="email"
                placeholder={emailPlaceholder}
                style={{ fontWeight: 300 }}
                className="w-full p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-gray-900"
              />
            )}
            {messagePlaceholder && (
              <textarea
                placeholder={messagePlaceholder}
                rows={4}
                style={{ fontWeight: 300 }}
                className="w-full p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-gray-900"
              />
            )}
          </div>
          {buttonText && (
            <button
              style={{ fontWeight: 300 }}
              className="w-full bg-gray-900 text-white p-4 rounded-xl hover:bg-black"
            >
              {buttonText}
            </button>
          )}
        </div>
        {imageUrl && (
          <div className="flex-1">
            <img
              src={imageUrl}
              alt={title || 'Contact'}
              className="w-full h-full object-cover rounded-3xl"
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default ContactLinkDynamic;
