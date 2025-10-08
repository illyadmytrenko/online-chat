export const Search = ({ handleSearch }: { handleSearch: (input: string) => void }) => {
  return (
    <input
      type="text"
      placeholder="Search (by @nickname)"
      onChange={(e) => handleSearch(e.target.value)}
      className="w-full h-[50px] p-4 border-2 border-gray-300 focus:border-[#9232d7] focus:outline-none bg-gray-500/85 text-white"
    />
  );
};
