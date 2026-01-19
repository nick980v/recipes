import React from "react";
import Link from "next/link";

const Tag = ({ tag }) => {
  const href = tag.toLowerCase().replace(/\s+/g, "-");
  return (
    <Link href={`tags/${href}`} passHref>
      <span className="bg-blue-100 text-blue-700 text-xs font-semibold py-1 px-2 rounded-full mr-2 mb-2 cursor-pointer hover:bg-blue-200">
        {tag}
      </span>
    </Link>
  );
};

export default Tag;
