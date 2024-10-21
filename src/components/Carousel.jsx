import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Carousel.css"; // CSS for styling;
import fallbackImg from "../Images/default-fallback-image.png";

const Carousel = () => {
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [currentCampaign, setCurrentCampaign] = useState(null);

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
        setCurrentCampaign(response.data.data[0]);
      } catch (err) {
        setError("Failed to fetch campaigns");
      } finally {
        setLoading(false);
      }
    };

    fetchCampaigns();
  }, []);

  useEffect(() => {
    setCurrentCampaign(campaigns[currentSlide]);
  }, [currentSlide]);

  useEffect(() => {
    console.log("current campaign", currentCampaign);
  }, [currentCampaign]);

  if (loading) {
    return <div className="loading skeleton"></div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % campaigns.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? campaigns.length - 1 : prev - 1));
  };

  return (
    <div className="carousel">
      <button onClick={prevSlide} className="carousel-button left">
        &#10094;
      </button>
      <div className="carousel-content">
        <div
          className={`carousel-item ${
            currentCampaign?.id - 1 === currentSlide ? "active" : ""
          }`}
          key={currentCampaign?.id}
        >
          {currentCampaign?.attributes?.splashImage?.data ? (
            <img
              src={currentCampaign.attributes.splashImage.data.attributes.url}
              alt={
                currentCampaign.attributes.splashImage.data.attributes.name ||
                "Campaign Image"
              }
            />
          ) : (
            <img src={fallbackImg} alt="Fallback Image" />
          )}

          <div className="campaign-info">
            <h2>{currentCampaign.attributes.name}</h2>
            <h3>{currentCampaign.attributes.title}</h3>
            <p>{currentCampaign.attributes.shortDescription}</p>

            {/*  Donation URL Button */}
            {currentCampaign?.attributes?.donationUrl && (
              <a
                href={currentCampaign.attributes.donationUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="donation-button"
              >
                Donate Now
              </a>
            )}
          </div>
        </div>
      </div>
      <button onClick={nextSlide} className="carousel-button right">
        &#10095;
      </button>

      <div className="carousel-indicators-container">
        <div className="carousel-indicators">
          {campaigns.map((_, index) => (
            <span
              key={index}
              className={`carousel-indicator ${
                index === currentSlide ? "active" : ""
              }`}
              onClick={() => setCurrentSlide(index)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Carousel;
