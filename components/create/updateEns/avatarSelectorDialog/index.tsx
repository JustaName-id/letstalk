import React from 'react';
import Cropper from 'cropperjs';
import 'cropperjs/dist/cropper.min.css';
import { useEnsAvatar, useUploadMedia } from '@justaname.id/react';
import { ChainId } from '@justaname.id/sdk';
import styles from './AvatarSelectorDialog.module.css';
import { Avatar, AvatarImage } from '@/components/ui/avatar';
import { ImagePlusIcon } from '@/lib/icons';
import { Dialog } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

export interface AvatarEditorDialogProps {
    onImageChange: (image: string) => void;
    avatar?: string | null;
    subname: string;
    chainId?: ChainId;
    address?: `0x${string}`;
    disableOverlay?: boolean;
}

export const AvatarEditorDialog: React.FC<AvatarEditorDialogProps> = ({
    onImageChange,
    avatar,
    subname,
    address,
    chainId,
    disableOverlay,
}) => {
    const { avatar: ensAvatar } = useEnsAvatar({
        ens: subname,
        chainId: chainId,
    });
    const [isEditorOpen, setIsEditorOpen] = React.useState(false);
    const [imageSrc, setImageSrc] = React.useState('');
    const imageElement = React.useRef<HTMLImageElement>(null);
    const cropper = React.useRef<Cropper | null>(null);
    const fileInputRef = React.useRef<HTMLInputElement>(null);
    const { uploadMedia, isUploadPending } = useUploadMedia({
        ens: subname,
        type: 'Avatar',
    });

    const handleImageLoaded = () => {
        if (imageElement.current) {
            cropper.current = new Cropper(imageElement.current, {
                aspectRatio: 1,
                viewMode: 1,
                autoCropArea: 1,
                highlight: false,
                dragMode: 'move',
            });
        }
    };

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
        if (cropper.current) {
            const zoomRatio = newZoomLevel / 100;
            cropper.current.zoomTo(zoomRatio);
        }
    };

    const handleSave = () => {
        if (cropper.current) {
            const croppedCanvas = cropper.current.getCroppedCanvas();
            croppedCanvas.toBlob(async (blob) => {
                if (!blob) return;
                if (blob.size > 3000000) {
                    // setIsEditorOpen(false);
                    // return;

                    const resizedCanvas = document.createElement('canvas');
                    const resizedContext = resizedCanvas.getContext('2d');
                    if (!resizedContext) return;
                    const MAX_SIZE = 1000;
                    let width = croppedCanvas.width;
                    let height = croppedCanvas.height;
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
                    resizedContext.drawImage(croppedCanvas, 0, 0, width, height);
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
    };

    const handleButtonClick = () => {
        fileInputRef.current?.click();
    };

    return (
        <>
            <div className="flex flex-row justify-center items-center"
                onClick={handleButtonClick}
            >
                <input
                    name='image-selector-input'
                    type="file"
                    accept="image/jpeg, image/png, image/heic, image/heif, image/gif, image/avif"
                    onChange={handleImageChange}
                    style={{ display: 'none' }}
                    ref={fileInputRef}
                />
                <Avatar className='cursor-pointer'>
                    <AvatarImage src={avatar || ensAvatar} />
                </Avatar>
                <div className={styles.overlay}>
                    <ImagePlusIcon
                        height={64}
                        width={64}
                        style={{
                            cursor: 'pointer',
                        }}
                    />
                </div>
            </div>
            <Dialog
                open={isEditorOpen}
                onOpenChange={(open: boolean) => {
                    setIsEditorOpen(open);
                }}
            >
                <div className={styles.responsiveDiv}>
                    <div className={styles.imageWrapper}>
                        <img
                            ref={imageElement}
                            src={imageSrc}
                            width={360}
                            height={360}
                            alt="Source"
                            crossOrigin="anonymous"
                            onLoad={handleImageLoaded}
                        />
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
                </div>
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
            </Dialog>
        </>
    );
};
