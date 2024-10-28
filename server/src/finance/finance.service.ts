import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateFinanceDto } from './dto/create-finance.dto';
import { UpdateFinanceDto } from './dto/update-finance.dto';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Finance } from './entities/finance.entity';
import { calculateFees } from '../utils/calculate-fee';
import { uploadSingleFileToCloudinary } from '../utils/file-upload.helper'; // Import helper function

@Injectable()
export class FinanceService {
  constructor(
    @InjectRepository(Finance)
    private readonly financeRepository: Repository<Finance>,
  ) {}

  async create(createFinanceDto: CreateFinanceDto, file?: Express.Multer.File) {
    let agreementFileUrl: string | null = null;

    if (file) {
      const uploadedFile = await uploadSingleFileToCloudinary(
        file,
        'agreements',
      );
      agreementFileUrl = uploadedFile.secure_url;
    }

    const { anualFee, monthlyFee, total, totalInWords } = calculateFees({
      registrationFee: createFinanceDto.registrationFee,
      examinationFee: createFinanceDto.examinationFee,
      admissionFee: createFinanceDto.admissionFee,
      securityDeposite: createFinanceDto.securityDeposite,
      otherCharges: createFinanceDto.otherCharges,
      tax: createFinanceDto.tax,
      extraCharges: createFinanceDto.extraCharges,
      discount: createFinanceDto.discount,
    });

    const finance = this.financeRepository.create({
      ...createFinanceDto,
      anualFee,
      monthlyFee,
      total,
      amountInWords: totalInWords,
      agreementFile: agreementFileUrl,
    });

    return await this.financeRepository.save(finance);
  }

  async findAll(): Promise<Finance[]> {
    return await this.financeRepository.find();
  }

  // Find one finance record by ID
  async findOne(id: string): Promise<Finance> {
    const finance = await this.financeRepository.findOne({ where: { id } });
    if (!finance) {
      throw new NotFoundException(`Finance record with ID ${id} not found`);
    }
    return finance;
  }

  async update(id: string, updateFinanceDto: UpdateFinanceDto, file?: any) {
    const finance = await this.financeRepository.findOne({ where: { id } });

    if (!finance) {
      throw new NotFoundException('Finance not found with id: ' + id);
    }

    // Keep the existing file if no new file is uploaded
    let agreementFileUrl: string | null = finance.agreementFile;

    // If a new file is uploaded, upload it to Cloudinary and update the file URL
    if (file) {
      const uploadedFile = await uploadSingleFileToCloudinary(
        file,
        'agreements',
      );
      agreementFileUrl = uploadedFile.secure_url;
    }

    // Recalculate fees using the updated data
    const { anualFee, monthlyFee, total, totalInWords } = calculateFees({
      registrationFee:
        updateFinanceDto.registrationFee || finance.registrationFee,
      examinationFee: updateFinanceDto.examinationFee || finance.examinationFee,
      admissionFee: updateFinanceDto.admissionFee || finance.admissionFee,
      securityDeposite:
        updateFinanceDto.securityDeposite || finance.securityDeposite,
      otherCharges: updateFinanceDto.otherCharges || finance.otherCharges,
      tax: updateFinanceDto.tax || finance.tax,
      extraCharges: updateFinanceDto.extraCharges || finance.extraCharges,
      discount: updateFinanceDto.discount || finance.discount,
    });

    // Assign updated values to the finance entity
    Object.assign(finance, {
      ...updateFinanceDto,
      anualFee,
      monthlyFee,
      total,
      amountInWords: totalInWords,
      agreementFile: agreementFileUrl, // Store the updated file URL or keep the existing one
    });

    // Save the updated finance entity to the database
    return await this.financeRepository.save(finance);
  }

  // Remove finance record
  async remove(id: string) {
    const finance = await this.financeRepository.findOne({ where: { id } });
    if (!finance) {
      throw new NotFoundException('Finance not found with id: ' + id);
    }
    await this.financeRepository.delete(id);
    return {
      message: `Finance record with id ${id} has been deleted successfully`,
    };
  }
}
