'use client';

import React from 'react';
import {
  Twitter,
  Facebook,
  Linkedin,
  Mail,
  Copy,
  Share2,
} from 'lucide-react';

interface SocialShareButtonsProps {
  title: string;
  content: string;
}

export const SocialShareButtons: React.FC<SocialShareButtonsProps> = ({
  title,
  content,
}) => {
  const [copied, setCopied] = React.useState(false);

  // Create a shareable URL (current page)
  const shareUrl = typeof window !== 'undefined' ? window.location.href : '';

  // Create text snippets for sharing
  const twitterText = encodeURIComponent(
    `${title}\n\n${content.substring(0, 100)}...`
  );
  const emailSubject = encodeURIComponent(`Check out my journal entry: ${title}`);
  const emailBody = encodeURIComponent(
    `I wanted to share this journal entry with you:\n\n${title}\n\n${content}\n\nRead more at: ${shareUrl}`
  );

  // Copy to clipboard
  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const shareLinks = [
    {
      name: 'Twitter',
      icon: Twitter,
      url: `https://twitter.com/intent/tweet?text=${twitterText}&url=${encodeURIComponent(shareUrl)}`,
      color: 'hover:text-blue-400',
    },
    {
      name: 'Facebook',
      icon: Facebook,
      url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`,
      color: 'hover:text-blue-600',
    },
    {
      name: 'LinkedIn',
      icon: Linkedin,
      url: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`,
      color: 'hover:text-blue-700',
    },
    {
      name: 'Email',
      icon: Mail,
      url: `mailto:?subject=${emailSubject}&body=${emailBody}`,
      color: 'hover:text-gray-600',
    },
  ];

  return (
    <div className="flex items-center gap-2 flex-wrap">
      <span className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-1">
        <Share2 size={16} />
        Share:
      </span>

      <div className="flex gap-3">
        {shareLinks.map((link) => {
          const IconComponent = link.icon;
          return (
            <a
              key={link.name}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              title={`Share on ${link.name}`}
              className={`text-gray-400 transition-colors duration-200 ${link.color}`}
              onClick={(e) => {
                e.preventDefault();
                if (link.name === 'Email') {
                  window.location.href = link.url;
                } else {
                  window.open(link.url, link.name, 'width=600,height=400');
                }
              }}
            >
              <IconComponent size={20} />
            </a>
          );
        })}

        {/* Copy Link Button */}
        <button
          onClick={handleCopyLink}
          title="Copy link to clipboard"
          className={`text-gray-400 transition-all duration-200 ${
            copied ? 'text-green-500' : 'hover:text-gray-600'
          }`}
        >
          <Copy size={20} />
        </button>
      </div>

      {copied && (
        <span className="text-xs text-green-600 dark:text-green-400">
          Copied!
        </span>
      )}
    </div>
  );
};
