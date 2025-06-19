import React from 'react';
import { CropperRef, Cropper } from 'react-advanced-cropper';
import 'react-advanced-cropper/dist/style.css';
import { useUploadMedia } from '@justaname.id/react';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ImagePlusIcon } from '@/lib/icons';
import { clientEnv } from '@/utils/config/clientEnv';

export interface BannerEditorDialogProps {
    onImageChange: (image: string) => void;
    banner: string;
    subname: string;
    disableOverlay?: boolean;
}

export const BannerEditorDialog: React.FC<BannerEditorDialogProps> = ({
    onImageChange,
    banner,
    subname,
    disableOverlay,
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

    const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newZoomLevel = parseFloat(e.target.value);
        const cropper = cropperRef.current;
        if (cropper) {
            const zoomRatio = newZoomLevel / 100;
            cropper.zoomImage(zoomRatio);
        }
    };

    const handleSave = async () => {
        const cropper = cropperRef.current;
        if (cropper) {
            const canvas = cropper.getCanvas();
            if (canvas) {
                canvas.toBlob(async (blob: Blob | null) => {
                    if (!blob) return;
                    if (blob.size > 3000000) {
                        const resizedCanvas = document.createElement('canvas');
                        const resizedContext = resizedCanvas.getContext('2d');
                        if (!resizedContext) return;
                        const MAX_WIDTH = 1500;
                        const MAX_HEIGHT = 500;
                        const width = canvas.width;
                        const height = canvas.height;
                        if (width > height) {
                            resizedCanvas.width = MAX_WIDTH;
                            resizedCanvas.height = (MAX_WIDTH * height) / width;
                        } else {
                            resizedCanvas.height = MAX_HEIGHT;
                            resizedCanvas.width = (MAX_HEIGHT * width) / height;
                        }
                        resizedContext.drawImage(canvas, 0, 0, resizedCanvas.width, resizedCanvas.height);
                        resizedCanvas.toBlob(async (resizedBlob) => {
                            if (!resizedBlob) return;
                            const formData = new FormData();
                            formData.append('file', resizedBlob);
                            try {
                                const response = await uploadMedia({ form: formData });
                                onImageChange(response.url);
                                setIsEditorOpen(false);
                                return;
                            } catch (error) {
                                console.error('Upload error', error);
                                return;
                            }
                        });
                    }
                    else {
                        const formData = new FormData();
                        formData.append('file', blob);

                        try {
                            const response = await uploadMedia({ form: formData });
                            onImageChange(response.url);
                            setIsEditorOpen(false);
                        } catch (error) {
                            console.error('Upload error', error);
                        }
                    }
                });
            }
        }
    };

    const handleButtonClick = () => {
        fileInputRef.current?.click();
    };

    return (
        <>
            <div className="relative w-full h-32 rounded-lg overflow-hidden border-2 border-dashed border-gray-300 hover:border-gray-400 transition-colors cursor-pointer group" onClick={handleButtonClick}>
                <img
                    src={banner}
                    alt="profile-banner"
                    className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity">
                    <ImagePlusIcon
                        width={32}
                        height={32}
                        className="text-white"
                    />
                </div>
                <input
                    name='banner-selector-input'
                    type="file"
                    accept="image/jpeg, image/png, image/heic, image/heif, image/gif, image/avif"
                    onChange={handleImageChange}
                    style={{ display: 'none' }}
                    ref={fileInputRef}
                />
            </div>

            <Dialog
                open={isEditorOpen}
                onOpenChange={(open: boolean) => {
                    setIsEditorOpen(open);
                }}
            >
                <div style={{ display: 'hidden' }}>
                    <DialogTitle>Crop Banner</DialogTitle>
                </div>
                <DialogContent aria-describedby={undefined} className="w-full h-fit max-h-[600px]">
                    <div className="w-full h-fit pt-5">
                        {imageSrc && (
                            <Cropper
                                ref={cropperRef}
                                src={imageSrc}
                                className="h-[400px] w-full"
                                stencilProps={{
                                    aspectRatio: 3,
                                }}
                                backgroundClassName="bg-gray-100"
                                canvas={true}
                                checkOrientation={false}
                                transitions={true}
                            />
                        )}
                    </div>
                    {/* Zoom slider - commented out but kept for potential future use */}
                    {/* <div className='flex flex-row justify-between items-center gap-2.5 w-full mb-2 mt-4 px-2'>
                        <button className="p-1">
                            <MinusIcon width={20} height={20} />
                        </button>
                        <input
                            name='slider-zoom-range-input'
                            className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                            min="1"
                            max="100"
                            type="range"
                            onChange={handleSliderChange}
                        />
                        <button className="p-1">
                            <AddIcon width={20} height={20} />
                        </button>
                    </div> */}
                    <div className='flex flex-row gap-2.5 mt-4'>
                        <Button
                            type="button"
                            variant="secondary"
                            onClick={() => {
                                if (fileInputRef.current) {
                                    fileInputRef.current.value = '';
                                }
                                setIsEditorOpen(false);
                            }}
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
                            {isUploadPending ? "Uploading..." : "Upload"}
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
        </>
    );
};
