import { useEffect, useState } from "react";

function UploadWidget({ uwConfig, setState }) {
  const [widget, setWidget] = useState(null);

  useEffect(() => {
    const scriptId = "cloudinary-upload-widget";

    // Load Cloudinary script only once
    if (!document.getElementById(scriptId)) {
      const script = document.createElement("script");
      script.src = "https://upload-widget.cloudinary.com/global/all.js";
      script.id = scriptId;
      script.async = true;
      script.onload = () => {
        initializeWidget();
      };
      document.body.appendChild(script);
    } else {
      initializeWidget();
    }

    // Cleanup function to avoid memory leaks
    return () => {
      if (widget) {
        setWidget(null); // Remove widget instance
      }
    };
  }, []);

  const initializeWidget = () => {
    if (!widget && window.cloudinary) {
      // Create the Cloudinary widget only once
      const myWidget = window.cloudinary.createUploadWidget(
        uwConfig,
        (error, result) => {
          if (!error && result.event === "success") {
            console.log("Uploaded image URL:", result.info.secure_url);
            setState((prev) => [...prev, result.info.secure_url]);
          }
        }
      );
      setWidget(myWidget); // Store the widget instance
    }
  };

  const openWidget = () => {
    if (widget) {
      widget.open(); // Open the widget
    }
  };

  return (
    <button onClick={openWidget} className="cloudinary-button">
      Upload
    </button>
  );
}

export default UploadWidget;
