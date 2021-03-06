import { BadRequestException, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { PaginatedResult } from './paginated-result.interface';

@Injectable()
export abstract class AbstractService {
  protected constructor(
    protected readonly repository: Repository<any>
  ) {}

  async all(relations = []): Promise<any[]> {
    return this.repository.find({ relations });
  }

  async paginate(page: number = 1, relations = []): Promise<PaginatedResult> {
    const take = 15;

    const [data, total] = await this.repository.findAndCount({
      take,
      skip: (page - 1) * take,
      relations
    });

    return {
      data,
      meta: {
        total,
        page,
        last_page: Math.ceil(total / take)
      }
    }
  }

  async create(data): Promise<any> {
    try {
      const user = await this.repository.save(data);
      return user;
    } catch (error) {
      throw new BadRequestException('이미 존재합니다.');
    }
  }

  async findOne(condition, relations = []): Promise<any> {
    return this.repository.findOne(condition, { relations });
  }

  async update(id: number, data): Promise<any> {
    return this.repository.update(id, data);
  }

  async delete(id: number): Promise<any> {
    return this.repository.delete(id);
  }
}
