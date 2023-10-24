import React, { useState } from "react";

function Lightbox({ src, alt }) {
  const [lightboxDisplay, setLightBoxDisplay] = useState(false);

  const showLightbox = () => {
    setLightBoxDisplay(true);
  };
  const hideLightBox = () => {
    setLightBoxDisplay(false);
  };

  const styles = {
    lightboxImg: {
      height: "80vh",
      maxWidth: "90vw",
      objectFit: "cover",
      cursor: "zoom-out",
    },

    lightbox: {
      textAlign: "center",
      zIndex: 99,
      position: "fixed",
      top: 0,
      left: 0,
      width: "100vw",
      height: "100%",
      backgroundColor: "rgba(255, 255, 255, 0.3)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    },

    galleryImg: {
      maxWidth: "250px",
      maxHeight: "250px",
      borderRadius: "10px",
      cursor: "zoom-in",
    },
  };

  return (
    <>
      <img
        src={src}
        alt={alt}
        style={styles.galleryImg}
        onClick={showLightbox}
      />

      {lightboxDisplay ? (
        <div onClick={hideLightBox} style={styles.lightbox}>
          <img src={src} alt={alt} style={styles.lightboxImg} />
        </div>
      ) : null}
    </>
  );
}
export default Lightbox;
