"use client";
import { useState, useEffect } from "react";

export default function HeadImages() {
  const images = [
    "/Images/Head-Img-Mobile1.png",
    "/Images/Head-Img-Mobile2.png",
    "/Images/Head-Img-Mobile3.png",
  ];

  const [current, setCurrent] = useState(0);
  const [next, setNext] = useState(1);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsAnimating(true);

      setTimeout(() => {
        setCurrent(next);
        setNext((next + 1) % images.length);
        setIsAnimating(false);
      }, 600); // duración de la animación
    }, 4000);

    return () => clearInterval(interval);
  }, [next]);

  return (
    <div className="img-container" style={{ position: "relative", overflow: "hidden" }}>
        <div className="fixed-text"></div>
      <div
        className="slide"
        style={{
          backgroundImage: `url(${images[current]})`,
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          transition: isAnimating ? "transform 0.6s ease-in-out" : "none",
          transform: isAnimating ? "translateX(-100%)" : "translateX(0)",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      ></div>

      <div
        className="slide"
        style={{
          backgroundImage: `url(${images[next]})`,
          position: "absolute",
          top: 0,
          left: "100%",
          width: "100%",
          height: "100%",
          transition: isAnimating ? "transform 0.6s ease-in-out" : "none",
          transform: isAnimating ? "translateX(-100%)" : "translateX(0)",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      ></div>
    </div>
  );
}
