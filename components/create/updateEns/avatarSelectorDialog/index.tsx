import { Avatar, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { ImagePlusIcon } from '@/lib/icons';
import { clientEnv } from '@/utils/config/clientEnv';
import { useEnsAvatar, useUploadMedia } from '@justaname.id/react';
import React from 'react';
import { Cropper, CropperRef } from 'react-advanced-cropper';
import 'react-advanced-cropper/dist/style.css';

export interface AvatarEditorDialogProps {
    onImageChange: (image: string) => void;
    avatar?: string | null;
    subname: string;
}

export const AvatarEditorDialog: React.FC<AvatarEditorDialogProps> = ({
    onImageChange,
    avatar,
    subname,
}) => {
    const { avatar: ensAvatar } = useEnsAvatar({
        ens: subname,
        chainId: clientEnv.chainId,
    });
    const [isEditorOpen, setIsEditorOpen] = React.useState(false);
    const [imageSrc, setImageSrc] = React.useState('');
    const cropperRef = React.useRef<CropperRef>(null);
    const fileInputRef = React.useRef<HTMLInputElement>(null);
    const { uploadMedia, isUploadPending } = useUploadMedia({
        ens: subname,
        type: 'Avatar',
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
            // react-advanced-cropper uses different zoom API
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
                        // Resize if too large
                        const resizedCanvas = document.createElement('canvas');
                        const resizedContext = resizedCanvas.getContext('2d');
                        if (!resizedContext) return;
                        const MAX_SIZE = 1000;
                        let width = canvas.width;
                        let height = canvas.height;
                        if (width > height) {
                            if (width > MAX_SIZE) {
                                height *= MAX_SIZE / width;
                                width = MAX_SIZE;
                            }
                        } else {
                            if (height > MAX_SIZE) {
                                width *= MAX_SIZE / height;
                                height = MAX_SIZE;
                            }
                        }
                        resizedCanvas.width = width;
                        resizedCanvas.height = height;
                        resizedContext.drawImage(canvas, 0, 0, width, height);
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
            <div className="flex flex-row justify-center items-center relative"

            >
                <input
                    name='image-selector-input'
                    id=''
                    type="file"
                    accept="image/jpeg, image/png, image/heic, image/heif, image/gif, image/avif"
                    onChange={handleImageChange}
                    style={{ display: 'none' }}
                    ref={fileInputRef}
                />
                <Avatar onClick={handleButtonClick} className='shadow-md cursor-pointer relative w-16 h-16 rounded-full'>
                    <AvatarImage src={avatar || ensAvatar} className='w-16 h-16 rounded-full' />
                    <ImagePlusIcon
                        height={24}
                        className="absolute left-[calc(50%-12px)] top-[calc(50%-12px)] flex items-center justify-center "
                        width={24}
                        style={{
                            cursor: 'pointer',
                        }}
                    />
                </Avatar>
            </div>
            <Dialog
                open={isEditorOpen}
                onOpenChange={(open: boolean) => {
                    setIsEditorOpen(open);
                }}
            >
                <div
                    style={{
                        display: 'hidden',
                    }}
                >
                    <DialogTitle></DialogTitle>
                </div>
                <DialogContent aria-describedby={undefined} className="w-full h-fit max-h-[500px]">
                    <div className="w-full h-fit pt-5">
                        {imageSrc && (
                            <Cropper
                                ref={cropperRef}
                                src={imageSrc}
                                className="h-[300px] w-[300px]"
                                stencilProps={{
                                    aspectRatio: 1,
                                }}
                                backgroundClassName="bg-gray-100 !translate-x-[8px] !translate-y-[8px]"
                                canvas={true}
                                checkOrientation={false}
                                transitions={true}
                            />
                        )}
                    </div>
                    {/* <div className='flex flex-row justify-between items-center gap-2.5'
                        style={{
                            width: '100%',
                            marginBottom: '2px',
                            marginTop: '10px',
                            padding: '0px 2px',
                        }}
                    >
                        <MinusIcon width={27} height={27} />
                        <input
                            name='slider-zoom-range-input'
                            className={styles.sliderInput}
                            min="1"
                            max="100"
                            type="range"
                            onChange={handleSliderChange}
                        />
                        <AddIcon width={27} height={27} />
                    </div> */}
                    <div className='flex flex-row gap-2.5'>
                        <Button
                            type="button"
                            variant="secondary"
                            onClick={() => {
                                if (fileInputRef.current) {
                                    fileInputRef.current.value = '';
                                }
                                setIsEditorOpen(false);
                            }}
                            style={{ flexGrow: '0.5' }}
                            disabled={isUploadPending}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="button"
                            onClick={handleSave}
                            variant="default"
                            style={{ flexGrow: '0.5' }}
                            disabled={isUploadPending}
                        >
                            Upload
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
        </>
    );
};
