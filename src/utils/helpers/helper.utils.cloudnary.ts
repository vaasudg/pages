import { v2, UploadApiResponse, UploadApiErrorResponse } from 'cloudinary'

export default (
    file: string,
    public_id?: string,
    overwrite?: boolean,
    invalidate?: boolean
): Promise<UploadApiResponse | UploadApiErrorResponse | undefined> => {
    return new Promise((resolve) => {
        v2.uploader.upload(
            file,
            {
                public_id,
                overwrite,
                invalidate
            },
            (error: UploadApiErrorResponse | undefined, result: UploadApiResponse | undefined) => {
                if (error) resolve(error)
                resolve(result)
            }
        )
    })
}