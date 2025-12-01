import { useState, useEffect, useRef } from 'react';
import { Textarea } from '../../../components/ui/Textarea';
import { Button } from '../../../components/ui/Button';
import { Card } from '../../../components/ui/Card';
import { ToolPageLayout } from '../../../components/layouts/ToolPageLayout';
import { CopyButton } from '../../../components/shared/CopyButton';
import useAppStore from '../../../store/useAppStore';
import { Upload, Image as ImageIcon, Download, RefreshCw } from 'lucide-react';

export default function ImageBase64Converter() {
  const [imagePreview, setImagePreview] = useState<string>('');
  const [base64Output, setBase64Output] = useState('');
  const [base64Input, setBase64Input] = useState('');
  const [fileName, setFileName] = useState('');
  const [fileSize, setFileSize] = useState('');
  const [imageDimensions, setImageDimensions] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { addRecentTool } = useAppStore();

  useEffect(() => {
    addRecentTool('image-base64-converter');
  }, [addRecentTool]);

  const handleFileSelect = (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('Please select a valid image file');
      return;
    }

    setFileName(file.name);
    setFileSize(formatFileSize(file.size));

    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      setImagePreview(result);
      setBase64Output(result);

      // Get image dimensions
      const img = new Image();
      img.onload = () => {
        setImageDimensions(`${img.width} × ${img.height}px`);
      };
      img.src = result;
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const file = e.dataTransfer.files[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleBase64ToImage = () => {
    if (!base64Input.trim()) {
      alert('Please enter a Base64 string');
      return;
    }

    try {
      // Add data URL prefix if not present
      let base64 = base64Input.trim();
      if (!base64.startsWith('data:')) {
        base64 = `data:image/png;base64,${base64}`;
      }

      setImagePreview(base64);
      setBase64Output(base64);

      // Get image dimensions
      const img = new Image();
      img.onload = () => {
        setImageDimensions(`${img.width} × ${img.height}px`);
      };
      img.src = base64;

      setFileName('converted-image');
    } catch (error) {
      alert('Invalid Base64 string');
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  const downloadImage = () => {
    if (!imagePreview) return;

    const link = document.createElement('a');
    link.href = imagePreview;
    link.download = fileName || 'image.png';
    link.click();
  };

  const reset = () => {
    setImagePreview('');
    setBase64Output('');
    setBase64Input('');
    setFileName('');
    setFileSize('');
    setImageDimensions('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <ToolPageLayout
      seo={{
        title: "Image to Base64 Converter - Convert Images to Base64 and Vice Versa",
        description: "Convert images to Base64 strings and Base64 to images online. Free image Base64 converter supporting PNG, JPG, GIF, and more. Embed images in CSS or HTML.",
        keywords: "image to base64, base64 to image, image encoder, base64 image, convert image, image base64 converter, data uri, free converter",
        path: "/tools/image-base64-converter"
      }}
      icon={ImageIcon}
      title="Image ↔ Base64 Converter"
      description="Convert between images and Base64 strings in both directions with drag & drop support"
      category="developer"
    >

      {/* Upload Area */}
      <Card className="p-8 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-transparent to-transparent pointer-events-none" />
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          className={`relative z-10 border-2 border-dashed rounded-2xl p-12 text-center transition-all duration-300 ${
            isDragging
              ? 'border-primary bg-primary/5 scale-105'
              : 'border-border hover:border-primary/50 hover:bg-muted/30'
          }`}
        >
          <div className="flex flex-col items-center gap-4">
            <div className="p-4 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 text-white shadow-lg">
              <Upload className="h-8 w-8" />
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2">
                {isDragging ? 'Drop your image here' : 'Upload an Image'}
              </h3>
              <p className="text-sm text-muted-foreground mb-4">
                Drag and drop or click to browse
              </p>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileInputChange}
                className="hidden"
              />
              <Button onClick={() => fileInputRef.current?.click()}>
                <Upload className="h-4 w-4 mr-2" />
                Choose File
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              Supports PNG, JPG, GIF, WebP, SVG
            </p>
          </div>
        </div>
      </Card>

      {/* Image Preview */}
      {imagePreview && (
        <Card className="p-6 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 via-transparent to-transparent pointer-events-none" />
          <div className="flex items-start justify-between mb-4 relative z-10">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 text-white shadow-lg">
                <ImageIcon className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold">Image Preview</h3>
                <p className="text-sm text-muted-foreground">
                  {fileName && `${fileName} • `}
                  {fileSize && `${fileSize} • `}
                  {imageDimensions}
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button onClick={downloadImage} variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Download
              </Button>
              <Button onClick={reset} variant="outline" size="sm">
                <RefreshCw className="h-4 w-4 mr-2" />
                Reset
              </Button>
            </div>
          </div>
          <div className="flex justify-center p-6 bg-muted/30 rounded-xl backdrop-blur-sm border border-border relative z-10">
            <img
              src={imagePreview}
              alt="Preview"
              className="max-w-full max-h-96 rounded-lg shadow-lg"
            />
          </div>
        </Card>
      )}

      {/* Base64 Output */}
      {base64Output && (
        <Card className="p-6 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 via-transparent to-transparent pointer-events-none" />
          <div className="flex items-center justify-between mb-4 relative z-10">
            <h3 className="text-lg font-bold">Base64 String</h3>
            <CopyButton text={base64Output} />
          </div>
          <Textarea
            value={base64Output}
            readOnly
            className="min-h-[200px] font-mono text-xs relative z-10"
            placeholder="Base64 output will appear here..."
          />
          <div className="mt-2 text-xs text-muted-foreground relative z-10">
            {base64Output.length.toLocaleString()} characters
          </div>
        </Card>
      )}

      {/* Base64 to Image */}
      <Card className="p-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 via-transparent to-transparent pointer-events-none" />
        <div className="relative z-10">
          <h3 className="text-lg font-bold mb-4">Base64 to Image</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Paste a Base64 string to convert it back to an image
          </p>
          <Textarea
            value={base64Input}
            onChange={(e) => setBase64Input(e.target.value)}
            className="min-h-[150px] font-mono text-xs mb-4"
            placeholder="Paste Base64 string here (with or without data:image prefix)..."
          />
          <Button onClick={handleBase64ToImage}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Convert to Image
          </Button>
        </div>
      </Card>
    </ToolPageLayout>
  );
}
