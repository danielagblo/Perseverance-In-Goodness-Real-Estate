import PropertyCard from "./PropertyCard";
import { IProperty } from "@/models/Property";

interface PropertyGridProps {
  properties: IProperty[];
}

export default function PropertyGrid({ properties }: PropertyGridProps) {
  if (properties.length === 0) {
    return (
      <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-[#D5C9B1]">
        <p className="text-[#7F8C8D] italic">No listings available at the moment. Check back soon.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {properties.map((property) => (
        <PropertyCard key={property._id?.toString()} property={property} />
      ))}
    </div>
  );
}
