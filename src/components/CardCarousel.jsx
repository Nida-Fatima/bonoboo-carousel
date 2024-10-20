import React, { useEffect, useState } from "react";
import axios from "axios";

const CardCarousel = () => {
  const [campaigns, setCampaigns] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCampaigns = async () => {
      try {
        const response = await axios.get(
          "https://backend.bonoboo.schnaq.consulting/api/donation-campaigns?sort[0]=id&populate=*",
          {
            headers: {
              Authorization: `bearer ${process.env.REACT_APP_API_KEY}`,
            },
          }
        );
        setCampaigns(response.data.data);
      } catch (err) {
        setError("Failed to fetch campaigns");
      } finally {
        setLoading(false);
      }
    };

    fetchCampaigns();
  }, []);

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % campaigns.length);
  };

  const prevSlide = () => {
    setCurrentIndex(
      (prevIndex) => (prevIndex - 1 + campaigns.length) % campaigns.length
    );
  };

  if (campaigns.length === 0) {
    return <div>Loading...</div>;
  }

  // Getting the currently active campaign
  const { attributes } = campaigns[currentIndex];
  const { title, shortDescription, splashImage, images } = attributes;

  return (
    <section>
      <div className="container-large">
        <div className="layout417_component">
          <div className="layout417_content">
            {/* Slider controls */}
            <button onClick={prevSlide} className="carousel-button prev">
              Prev
            </button>

            <div className="layout417_list">
              <div
                className="layout417_card"
                style={{
                  transform: "translate3d(0vw, 0vh, 0px) scale3d(1, 1, 1)",
                }}
              >
                {/* Card 1 */}
                <div className="margin-bottom margin-medium">
                  <img
                    src={splashImage.data.attributes.formats.small.url}
                    loading="lazy"
                    alt={splashImage.data.attributes.name}
                    className="icon-1x1-medium"
                  />
                </div>
                <div className="layout417_card-content">
                  <div className="margin-bottom margin-xsmall">
                    <h5>{title}</h5>
                  </div>
                  <p>{shortDescription}</p>
                </div>
              </div>

              {/* Render additional images as separate cards */}
              {images.data.map((image, index) => (
                <div
                  key={image.id}
                  className={`layout417_card card-${index + 2}`}
                  style={{
                    transform: `translate3d(0vw, 0vh, 0px) rotateZ(${
                      index * 3
                    }deg)`,
                  }}
                >
                  <div className="margin-bottom margin-medium">
                    <img
                      src={image.attributes.formats.thumbnail.url}
                      loading="lazy"
                      alt={image.attributes.name}
                      className="icon-1x1-medium"
                    />
                  </div>
                  <div className="layout417_card-content">
                    <div className="margin-bottom margin-xsmall">
                      <h5>Image {index + 1}</h5>
                    </div>
                    <p>Additional campaign images.</p>
                  </div>
                </div>
              ))}
            </div>

            <button onClick={nextSlide} className="carousel-button next">
              Next
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CardCarousel;
