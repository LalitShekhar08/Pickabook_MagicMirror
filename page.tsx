"use client";
import { useState } from "react";

export default function Home() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setResultUrl(null);
      setError(null);
    }
  };

  const handleGenerate = async () => {
    if (!selectedFile) return;
    setLoading(true);
    setError(null);
    const formData = new FormData();
    formData.append("file", selectedFile);

    try {
      const res = await fetch("http://localhost:8000/generate-magic", {
        method: "POST",
        body: formData,
      });
      if (!res.ok) throw new Error("Failed to connect to backend");
      const data = await res.json();
      if (data.url) setResultUrl(data.url);
      else throw new Error("No URL returned");
    } catch (err) {
      console.error(err);
      setError("Something went wrong. Is the backend running?");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main>
      <header>
        <h1>Pickabook Assignment <span>Magic Mirror</span></h1>
        <p>Upload a photo to create a magical storybook illustration.</p>
      </header>

      <div>
        {/* LEFT CARD*/}
        <div>
          <h2>1. Upload Image</h2>
          
          <input type="file" accept="image/*" onChange={handleFileSelect} />

          {/* Show Filename */}
          {selectedFile ? (
            <div style={{ textAlign: 'center', margin: '20px 0', color: '#4ade80' }}>
              <div style={{ fontSize: '40px', marginBottom: '10px' }}>✅</div>
              <p style={{ fontWeight: 'bold', fontSize: '1.1rem', wordBreak: 'break-all' }}>{selectedFile.name}</p>
              <p style={{ fontSize: '0.9rem', color: '#cbd5e1', marginTop: '5px' }}>Ready to generate!</p>
            </div>
          ) : (
             <div style={{ textAlign: 'center', margin: '30px 0', color: '#94a3b8' }}>
               <p style={{ fontSize: '1.1rem' }}>No file selected</p>
             </div>
          )}

          <button onClick={handleGenerate} disabled={!selectedFile || loading}>
            {loading ? "✨ Creating Magic..." : "Generate illustration"}
          </button>
          
          {error && <p style={{ color: '#f87171', marginTop: '15px', textAlign: 'center' }}>{error}</p>}
        </div>

        {/* RIGHT CARD */}
        <div>
          {/* "2. The Result" heading removed from here */}
          
          {loading ? (
            <div className="loading-container">
              <div style={{ fontSize: '50px' }} className="animate-spin">🔮</div>
              <p style={{ marginTop: '20px', fontSize: '1.2rem', color: '#cbd5e1' }}>Weaving the magic...</p>
            </div>
          ) : resultUrl ? (
            <>
              <img src={resultUrl} alt="Generated Image" />
              <a 
                href={resultUrl} 
                target="_blank"
                style={{
                  display: 'block', width: '100%', textAlign: 'center',
                  background: 'linear-gradient(to right, #10b981, #059669)', 
                  padding: '18px', borderRadius: '12px',
                  color: 'white', textDecoration: 'none', fontWeight: 'bold',
                  fontSize: '1.2rem', marginTop: 'auto'
                }}
              >
                Download Image
              </a>
            </>
          ) : (
            <p className="placeholder-text">Magic Image will appear here.</p>
          )}
        </div>
      </div>
    </main>
  );
}