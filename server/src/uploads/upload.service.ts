import { Injectable, BadRequestException } from '@nestjs/common';
import { CloudinaryProvider } from './cloudinary.provider';
import { UploadedFile } from 'express-fileupload';

@Injectable()
export class UploadService {
  constructor(private readonly cloudinaryProvider: CloudinaryProvider) {}

  async uploadFile(file: UploadedFile): Promise<any> {
    if (!file) {
      throw new BadRequestException('No file uploaded');
    }

    try {
      // Upload file to Cloudinary
      const result = await this.cloudinaryProvider.uploadImage(
        file.tempFilePath,
      );
      return result;
    } catch (error) {
      throw new BadRequestException('File upload failed', error.message);
    }
  }
    // async updateProfilePicture(file: Express.Multer.File, oldPublicId?: string): Promise<string> {
  //   try {
  //     // Delete the old image if a public ID is provided
  //     if (oldPublicId) {
  //       await deleteFileFromCloudinary(oldPublicId);
  //       console.log("Old profile picture deleted:", oldPublicId);
  //     }

  //     // Upload the new profile picture
  //     const uploadedPicture = await uploadSingleFileToCloudinary(file, 'user_profile_pictures');
  //     console.log("New profile picture uploaded:", uploadedPicture.secure_url);

  //     // Return the secure URL of the new profile picture
  //     return uploadedPicture.secure_url;
  //   } catch (error) {
  //     console.error("Failed to update profile picture:", error);
  //     throw new InternalServerErrorException("Failed to update profile picture");
  //   }
  // }
  // async updateMultipleFiles(files: Express.Multer.File[], oldPublicIds?: string[]): Promise<string[]> {
  //   try {
  //     // Delete old images if public IDs are provided
  //     if (oldPublicIds && oldPublicIds.length > 0) {
  //       await Promise.all(oldPublicIds.map(publicId => deleteFileFromCloudinary(publicId)));
  //       console.log("Old documents deleted:", oldPublicIds);
  //     }

  //     // Upload new files
  //     const uploadedUrls = await uploadFilesToCloudinary(files, 'user_documents');
  //     console.log("New documents uploaded:", uploadedUrls);

  //     // Return secure URLs of the new documents
  //     return uploadedUrls;
  //   } catch (error) {
  //     console.error("Failed to update documents:", error);
  //     throw new InternalServerErrorException("Failed to update documents");
  //   }
  // }
  // async uploadProfilePicture(file: Express.Multer.File): Promise<any> {
  //   if (!file) {
  //     throw new BadRequestException('No file provided');
  //   }

  //   console.log("Uploading profile picture to Cloudinary");

  //   try {
  //     const uploadedPicture = await uploadSingleFileToCloudinary(file, 'user_profile_pictures');
  //     console.log("Profile picture uploaded successfully:", uploadedPicture.secure_url);
  //     return {
  //       message: 'Profile picture uploaded successfully',
  //       secureUrl: uploadedPicture.secure_url,
  //     };
  //   } catch (error) {
  //     console.error("Failed to upload profile picture:", error);
  //     throw new InternalServerErrorException("Failed to upload profile picture to Cloudinary");
  //   }
  // }
  // async uploadMultipleFiles(files: Express.Multer.File[]): Promise<any> {
  //   console.log("Uploading multiple files to Cloudinary");

  //   try {
  //     const uploadedFiles = await uploadFilesToCloudinary(files, 'user_documents');
  //     console.log("Files uploaded successfully:", uploadedFiles);
  //     return {
  //       message: 'Files uploaded successfully',
  //       uploadedFiles,
  //     };
  //   } catch (error) {
  //     console.error("Failed to upload files:", error);
  //     throw new InternalServerErrorException("Failed to upload files to Cloudinary");
  //   }
  // }
}
