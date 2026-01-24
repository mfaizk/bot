import React from "react";

const IntoVideo = () => {
  return (
    <section className="bg-[#030b1f] text-white pt-24 md:pt-35 px-6 md:px-20 relative overflow-hidden">
      <iframe
        width="100%"
        height="600px"
        src="https://www.youtube.com/embed/o5lnA4xTfA4?si=vwC2YH5MzgQGgvY0"
        title="YouTube video player"
        frameborder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        referrerpolicy="strict-origin-when-cross-origin"
        allowfullscreen
      ></iframe>
    </section>
  );
};

export default IntoVideo;
