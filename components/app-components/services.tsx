import { BentoGrid, BentoGridItem } from "../ui/bento-grid";


export function Services() {
  return (
    <section className="py-14 md:pt-24 border-t">
      <BentoGrid className="max-w-4xl mx-auto md:auto-rows-[20rem]">
        {items.map((item, i) => (
          <BentoGridItem
            key={i}
            title={item.title}
            description={item.description}
            header={item.header}
            className={item.className}
          />
        ))}
      </BentoGrid>
    </section>
  );
}
const Skeleton = ({image}:{image?: string}) => (
  <div className="flex flex-1 w-full h-full min-h-24 rounded-xl  dark:bg-dot-white/[0.2] bg-dot-black/[0.2] mask-[radial-gradient(ellipse_at_center,white,transparent)]  border border-transparent dark:border-white/20 bg-neutral-100 dark:bg-black bg-top bg-cover" style={{ backgroundImage: image ? `url(${image})` : undefined }}></div>
);
const items = [
  {
    title: "Bespoke",
    description: "Custom-made garment created entirely from scratch based on your exact body measurements and specifications",
    header: <Skeleton image="/bespoke.webp" />,
    className: "md:col-span-2",
  },
  {
    title: "Kaftan",
    description: "A long, loose and flowing garment, typically characterized by wide, batwing-style sleeves and an ankle-length hem.",
    header: <Skeleton image="/kaftan.webp" />,
    className: "md:col-span-1",
  },
  {
    title: "Monogram",
    description: "Discover the beauty of thoughtful and functional design.",
    header: <Skeleton image="/monogram.webp" />,
    className: "md:col-span-1",
  },
  {
    title: "Native & Traditional Wears",
    description:
      "Understand the impact of effective communication in our lives.",
    header: <Skeleton image="/female.webp" />,
    className: "md:col-span-2",
  },
  {
    title: "Boutique & Ready To Wear",
    description:
      "Understand the impact of effective communication in our lives.",
    header: <Skeleton image="/boutique-ready.webp" />,
    className: "md:col-span-2",
  },
];
