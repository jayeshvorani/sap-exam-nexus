
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Upload, X } from "lucide-react";
import { useState } from "react";

interface ImageUploadProps {
  imageUrl?: string;
  onImageChange: (imageUrl: string) => void;
}

const ImageUpload = ({ imageUrl, onImageChange }: ImageUploadProps) => {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(imageUrl || null);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setImagePreview(result);
        onImageChange(result);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview(null);
    onImageChange("");
  };

  return (
    <div>
      <Label>Question Image (Optional)</Label>
      <div className="mt-2">
        {imagePreview ? (
          <div className="relative inline-block">
            <img 
              src={imagePreview} 
              alt="Question preview" 
              className="max-w-xs max-h-48 rounded-lg border"
            />
            <Button
              type="button"
              variant="destructive"
              size="sm"
              className="absolute top-2 right-2"
              onClick={removeImage}
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        ) : (
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
            <Upload className="w-8 h-8 mx-auto text-gray-400 mb-2" />
            <p className="text-sm text-gray-600 mb-2">Upload an image for this question</p>
            <Input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
              id="image-upload"
            />
            <Button type="button" variant="outline" asChild>
              <Label htmlFor="image-upload" className="cursor-pointer">
                Choose Image
              </Label>
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ImageUpload;
