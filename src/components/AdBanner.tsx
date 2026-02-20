import { useEffect, useState } from 'react';

interface Ad {
  id: number;
  title: string;
  description: string;
  image: string;
  link: string;
  link_text: string;
  active: boolean;
  position: string;
}

interface Props {
  position?: string;
}

export default function AdBanner({ position = 'sidebar' }: Props) {
  const [ad, setAd] = useState<Ad | null>(null);

  useEffect(() => {
    fetch(`/api/ads.php?position=${position}&active`)
      .then(r => r.json())
      .then((ads: Ad[]) => {
        if (ads.length > 0) setAd(ads[0]);
      })
      .catch(() => {});
  }, [position]);

  if (!ad) return null;

  const content = (
    <div className="rounded-xl overflow-hidden bg-primary text-white">
      {ad.image && (
        <img
          src={ad.image}
          alt={ad.title}
          className="w-full object-cover"
          style={{ maxHeight: '180px' }}
        />
      )}
      <div className="p-6">
        <h3 className="text-lg font-bold leading-snug">{ad.title}</h3>
        {ad.description && (
          <p className="mt-2 text-sm text-white/80 leading-relaxed">{ad.description}</p>
        )}
        {ad.link_text && (
          <div className="mt-4">
            <span className="inline-block w-full text-center py-2.5 bg-white text-primary font-semibold text-sm rounded-lg hover:bg-blue-50 transition cursor-pointer">
              {ad.link_text}
            </span>
          </div>
        )}
      </div>
    </div>
  );

  if (ad.link) {
    return (
      <a href={ad.link} target="_blank" rel="noopener noreferrer" className="block">
        {content}
      </a>
    );
  }

  return content;
}
