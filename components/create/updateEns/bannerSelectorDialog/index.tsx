import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { ImagePlusIcon } from '@/lib/icons';
import { clientEnv } from '@/utils/config/clientEnv';
import { useUploadMedia } from '@justaname.id/react';
import React from 'react';
import {Cropper, CropperRef, ImageRestriction} from 'react-advanced-cropper';
import 'react-advanced-cropper/dist/style.css';

export interface BannerEditorDialogProps {
    onImageChange: (image: string) => void;
    banner?: string;
    subname: string;
}

export const BannerEditorDialog: React.FC<BannerEditorDialogProps> = ({
                                                                          onImageChange,
                                                                          banner,
                                                                          subname,
                                                                      }) => {
    const [isEditorOpen, setIsEditorOpen] = React.useState(false);
    const [imageSrc, setImageSrc] = React.useState('');
    const cropperRef = React.useRef<CropperRef>(null);
    const fileInputRef = React.useRef<HTMLInputElement>(null);
    const { uploadMedia, isUploadPending } = useUploadMedia({
        ens: subname,
        type: 'Banner',
        chainId: clientEnv.chainId,
    });

    const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files.length > 0) {
            const reader = new FileReader();
            reader.onload = (e) => {
                setImageSrc(e.target?.result as string);
                setIsEditorOpen(true);
            };
            reader.readAsDataURL(event.target.files[0]);
        }
    };

    const handleSave = async () => {
        const cropper = cropperRef.current;
        if (!cropper) return;

        // Use getCoordinates and getVisibleArea for more reliable cropping
        const coordinates = cropper.getCoordinates();
        const visibleArea = cropper.getVisibleArea();

        if (!coordinates || !visibleArea) {
            console.error('Could not get crop coordinates');
            return;
        }

        // Create canvas manually for better control
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');

        if (!ctx) {
            console.error('Could not get canvas context');
            return;
        }

        // Load the original image
        const img = new Image();
        img.crossOrigin = 'anonymous';

        img.onload = async () => {
            try {
                // Set canvas size to match crop area
                canvas.width = coordinates.width;
                canvas.height = coordinates.height;

                // Draw the cropped portion
                ctx.drawImage(
                    img,
                    coordinates.left,
                    coordinates.top,
                    coordinates.width,
                    coordinates.height,
                    0,
                    0,
                    coordinates.width,
                    coordinates.height
                );

                // Convert to blob with quality control
                canvas.toBlob(async (blob: Blob | null) => {
                    if (!blob) {
                        console.error('Could not create blob from canvas');
                        return;
                    }

                    let finalBlob: Blob | null = blob;

                    // Handle large files by resizing with banner-specific dimensions
                    if (blob.size > 3000000) {
                        const resizedCanvas = document.createElement('canvas');
                        const resizedCtx = resizedCanvas.getContext('2d');
                        if (!resizedCtx) return;

                        const MAX_WIDTH = 1500;
                        const MAX_HEIGHT = 500;
                        let { width, height } = canvas;

                        // Calculate new dimensions maintaining aspect ratio for banner
                        const aspectRatio = width / height;
                        if (aspectRatio > 3) {
                            // Wide banner
                            if (width > MAX_WIDTH) {
                                width = MAX_WIDTH;
                                height = width / aspectRatio;
                            }
                        } else {
                            // Tall or square banner
                            if (height > MAX_HEIGHT) {
                                height = MAX_HEIGHT;
                                width = height * aspectRatio;
                            }
                        }

                        resizedCanvas.width = width;
                        resizedCanvas.height = height;

                        // Use better image smoothing
                        resizedCtx.imageSmoothingEnabled = true;
                        resizedCtx.imageSmoothingQuality = 'high';
                        resizedCtx.drawImage(canvas, 0, 0, width, height);

                        // Convert resized canvas to blob
                        const resizedBlobPromise = new Promise<Blob | null>((resolve) => {
                            resizedCanvas.toBlob(resolve, 'image/jpeg', 0.9);
                        });

                        finalBlob = await resizedBlobPromise;
                        if (!finalBlob) return;
                    }

                    // Upload the final blob
                    const formData = new FormData();
                    formData.append('file', finalBlob);

                    try {
                        const response = await uploadMedia({ form: formData });
                        onImageChange(response.url);
                        setIsEditorOpen(false);
                        // Clear the file input
                        if (fileInputRef.current) {
                            fileInputRef.current.value = '';
                        }
                    } catch (error) {
                        console.error('Upload error:', error);
                    }
                }, 'image/jpeg', 0.9);

            } catch (error) {
                console.error('Error processing image:', error);
            }
        };

        img.onerror = () => {
            console.error('Error loading image for cropping');
        };

        img.src = imageSrc;
    };

    const handleButtonClick = () => {
        fileInputRef.current?.click();
    };

    const handleDialogClose = (open: boolean) => {
        setIsEditorOpen(open);
        if (!open) {
            // Clear image source when closing
            setImageSrc('');
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
        }
    };

    return (
        <>
            <div className="relative w-full h-[64px] rounded-[6px] shadow-md transition-colors cursor-pointer group" onClick={handleButtonClick}>
                <img
                    src={banner}
                    alt=""
                    className="w-full max-h-[64px] object-cover rounded-lg"
                />
                <div className="absolute z-[10] inset-0 flex flex-row items-center gap-1 justify-center">
                    <ImagePlusIcon
                        width={24}
                        height={24}
                    />
                    <p className='text-foreground font-bold text-xs'>Background</p>
                </div>
                <input
                    name='banner-selector-input'
                    type="file"
                    accept="image/jpeg,image/png,image/heic,image/heif,image/gif,image/avif,image/webp"
                    onChange={handleImageChange}
                    style={{ display: 'none' }}
                    ref={fileInputRef}
                />
            </div>

            <Dialog
                open={isEditorOpen}
                onOpenChange={handleDialogClose}
            >
                <div style={{ display: 'none' }}>
                    <DialogTitle>Crop Banner Image</DialogTitle>
                </div>
                <DialogContent
                    aria-describedby={undefined}
                    className="w-full max-w-4xl mx-auto p-4"
                    style={{ maxHeight: '90vh', overflow: 'hidden' }}
                >
                    <div className="w-full flex flex-col items-center space-y-4">
                        {imageSrc && (
                            <div className="w-full max-w-[600px]" style={{ aspectRatio: '3/1' }}>
                                <Cropper
                                    ref={cropperRef}
                                    src={imageSrc}
                                    className="w-full h-full"
                                    stencilProps={{
                                        aspectRatio: 3,
                                        movable: true,
                                        resizable: true,
                                        lines: true,
                                        handlers: true,
                                    }}
                                    // stencilSize={{
                                    //     width: 600,
                                    //     height: 200,
                                    // }}
                                    imageRestriction={ImageRestriction.stencil}
                                    checkOrientation={true}
                                    // canvas={{
                                    //     width: 1200,
                                    //     height: 400,
                                    // }}
                                    transitions={true}
                                />
                            </div>
                        )}
                        <div className='flex flex-row gap-2.5 w-full max-w-md'>
                            <Button
                                type="button"
                                variant="secondary"
                                onClick={() => handleDialogClose(false)}
                                className="flex-1"
                                disabled={isUploadPending}
                            >
                                Cancel
                            </Button>
                            <Button
                                type="button"
                                onClick={handleSave}
                                variant="default"
                                className="flex-1"
                                disabled={isUploadPending}
                            >
                                {isUploadPending ? 'Uploading...' : 'Upload'}
                            </Button>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </>
    );
};