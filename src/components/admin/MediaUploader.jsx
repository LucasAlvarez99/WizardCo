/* src/components/admin/MediaUploader.jsx
   Widget de subida de fotos/video con arrastrar-y-soltar. Sube directo del
   navegador a Cloudinary (sin pasar por nuestro backend) usando un upload
   preset "unsigned" — ver CLOUDINARY_CLOUD_NAME/CLOUDINARY_UPLOAD_PRESET
   en src/data/config.js.

   value: array de URLs ya subidas (imágenes) o de 0-1 elemento (video).
   onChange(nextArray) se llama cada vez que se agrega o quita un archivo. */

async function uploadToCloudinary(file, resourceType) {
  if (!CLOUDINARY_CLOUD_NAME || CLOUDINARY_CLOUD_NAME === "WizardCo-productos") {
    throw new Error("Falta configurar Cloudinary: completá CLOUDINARY_CLOUD_NAME en src/data/config.js.");
  }

  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);
  // La carpeta ya está fija en el preset (wizardco/productos), no hace
  // falta (ni conviene) mandarla también acá.

  let response;
  try {
    response = await fetch(`https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/${resourceType}/upload`, {
      method: "POST",
      body: formData,
    });
  } catch (err) {
    throw new Error("No se pudo contactar a Cloudinary. Revisá tu conexión.");
  }

  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(data.error?.message || "Cloudinary rechazó el archivo (revisá el upload preset).");
  }
  return data.secure_url;
}

function MediaUploader({ label, resourceType, max, value, onChange, hint }) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [dragOver, setDragOver] = useState(false);
  const inputRef = useRef(null);

  const remainingSlots = max - value.length;

  const handleFiles = async (fileList) => {
    const files = Array.from(fileList).slice(0, remainingSlots);
    if (files.length === 0) return;

    setError("");
    setUploading(true);
    try {
      const uploaded = [];
      for (const file of files) {
        // Se suben de a una para no saturar la conexión y poder mostrar
        // un error claro si una falla sin perder las que ya subieron.
        const url = await uploadToCloudinary(file, resourceType);
        uploaded.push(url);
      }
      onChange([...value, ...uploaded]);
    } catch (err) {
      setError(err.message);
    } finally {
      setUploading(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    if (remainingSlots <= 0) return;
    handleFiles(e.dataTransfer.files);
  };

  const handleRemove = (url) => {
    onChange(value.filter((u) => u !== url));
  };

  return (
    <div className="media-uploader">
      <p className="media-uploader__label">{label}</p>

      <div className="media-uploader__grid">
        {value.map((url) => (
          <div key={url} className="media-uploader__thumb">
            {resourceType === "video" ? (
              <video src={url} muted />
            ) : (
              <img src={url} alt="" />
            )}
            <button
              type="button"
              className="media-uploader__remove"
              onClick={() => handleRemove(url)}
              aria-label="Quitar"
            >
              <IconX size={13} />
            </button>
          </div>
        ))}

        {remainingSlots > 0 && (
          <div
            className={`media-uploader__dropzone ${dragOver ? "media-uploader__dropzone--over" : ""}`}
            onClick={() => inputRef.current?.click()}
            onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onDrop={handleDrop}
          >
            {uploading ? (
              <IconLoader size={20} />
            ) : (
              <React.Fragment>
                <IconUpload size={18} />
                <span>{resourceType === "video" ? "Subir video" : "Arrastrá o hacé clic"}</span>
              </React.Fragment>
            )}
            <input
              ref={inputRef}
              type="file"
              accept={resourceType === "video" ? "video/*" : "image/*"}
              multiple={remainingSlots > 1}
              hidden
              onChange={(e) => {
                handleFiles(e.target.files);
                e.target.value = ""; // permite volver a elegir el mismo archivo
              }}
            />
          </div>
        )}
      </div>

      {hint && <p className="media-uploader__hint">{hint}</p>}
      {error && <p className="form-error"><IconAlert size={13} /> {error}</p>}
    </div>
  );
}
