export const uploadImage = async (file) => {
    const cloudinaryName = import.meta.env.VITE_CLOUDINARY_NAME;
    const cloudinaryPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;
    const formData = new FormData();
    formData.append('file', file)
    formData.append('upload_preset', cloudinaryPreset)

    try {
        const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudinaryName}/image/upload`, {
            method: 'POST',
            body: formData
        })

        if (!response.ok) {
            throw new Error('Upload Failed');
        }

        const data = await response.json();

        return data.secure_url;

    } catch (error) {
        throw new Error('There was a problem with the request')
    }
}