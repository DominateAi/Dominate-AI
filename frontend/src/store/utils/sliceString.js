const displaySmallText = (text, count, insertDots) => {
  return (
    text.slice(0, count) + (text.length > count && insertDots ? "..." : "")
  );
};

export default displaySmallText;
