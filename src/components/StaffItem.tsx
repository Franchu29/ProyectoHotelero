type StaffItemProps = {
  name: string;
  rating: string;
};

export default function StaffItem({ name, rating }: StaffItemProps) {
  return (
    <div className="flex justify-between items-center">
      <div>
        <p className="font-medium">{name}</p>
        <p className="text-sm text-gray-500">⭐ {rating}</p>
      </div>
      <button className="text-gray-400">→</button>
    </div>
  );
}