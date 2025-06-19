import React from 'react';
import 'cropperjs';
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
    const cropperCanvasRef = React.useRef<any>(null);
    const cropperImageRef = React.useRef<any>(null);
    const cropperSelectionRef = React.useRef<any>(null);
    const fileInputRef = React.useRef<HTMLInputElement>(null);
    const { uploadMedia, isUploadPending } = useUploadMedia({
        ens: subname,
        type: 'Avatar',
    });

    React.useEffect(() => {
        if (cropperCanvasRef.current && imageSrc) {
            // Initialize the cropper elements after the DOM is ready
            const cropperImage = cropperCanvasRef.current.querySelector('cropper-image');
            const cropperSelection = cropperCanvasRef.current.querySelector('cropper-selection');

            if (cropperImage && cropperSelection) {
                cropperImage.src = imageSrc;
                cropperImageRef.current = cropperImage;
                cropperSelectionRef.current = cropperSelection;

                // Set aspect ratio to 1:1 for square cropping (migration: aspectRatio → aspectRatio property)
                cropperSelection.aspectRatio = 1;
                // Set initial coverage to 1 (migration: autoCropArea → initialCoverage property)
                cropperSelection.setAttribute('initial-coverage', '1');
            }
        }
    }, [imageSrc]);

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
        if (cropperImageRef.current) {
            const zoomRatio = newZoomLevel / 100;
            // Migration: zoomTo → $setTransform method
            cropperImageRef.current.$setTransform({
                scaleX: zoomRatio,
                scaleY: zoomRatio
            });
        }
    };

    const handleSave = async () => {
        if (cropperSelectionRef.current) {
            try {
                // Migration: getCroppedCanvas → $toCanvas method
                const croppedCanvas = await cropperSelectionRef.current.$toCanvas();

                croppedCanvas.toBlob(async (blob: Blob | null) => {
                    if (!blob) return;

                    if (blob.size > 3000000) {
                        // Resize if too large
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
                            } catch (error) {
                                console.error('Upload error', error);
                            }
                        });
                    } else {
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
            } catch (error) {
                console.error('Cropping error', error);
            }
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
                        {/* @ts-ignore */}
                        <cropper-canvas ref={cropperCanvasRef} background>
                            {/* @ts-ignore */}
                            <cropper-image
                                alt="Source"
                                crossOrigin="anonymous"
                                rotatable
                                scalable
                                translatable
                            />
                            <cropper-shade hidden />
                            <cropper-handle action="select" plain />
                            <cropper-selection
                                initial-coverage="1"
                                movable
                                resizable
                            >
                                <cropper-grid role="grid" covered />
                                <cropper-crosshair centered />
                                <cropper-handle action="move" theme-color="rgba(255, 255, 255, 0.35)" />
                                <cropper-handle action="n-resize" />
                                <cropper-handle action="e-resize" />
                                <cropper-handle action="s-resize" />
                                <cropper-handle action="w-resize" />
                                <cropper-handle action="ne-resize" />
                                <cropper-handle action="nw-resize" />
                                <cropper-handle action="se-resize" />
                                <cropper-handle action="sw-resize" />
                            </cropper-selection>
                        </cropper-canvas>
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