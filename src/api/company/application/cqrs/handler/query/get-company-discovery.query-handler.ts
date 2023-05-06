import { EventBus, IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetCompanyDiscoveryQuery } from '../../query/get-company-discovery.query';
import CompanyEntity from '../../../../domain/entities/company.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ErrorCustomEvent } from '../../../../../../util/exception/error-handler/error-custom.event';

@QueryHandler(GetCompanyDiscoveryQuery)
export class GetCompanyDiscoveryQueryHandler implements IQueryHandler<GetCompanyDiscoveryQuery> {
  private readonly EARTH_RADIUS = 6378137; // rayon de la Terre en mètres

  constructor(
    @InjectRepository(CompanyEntity)
    private readonly companyRepository: Repository<CompanyEntity>,
    private readonly eventBus: EventBus,
  ) {}

  async execute(query: GetCompanyDiscoveryQuery): Promise<CompanyEntity[]> {
    let company: CompanyEntity[] = await this.companyRepository
      .find({
        relations: [
          'occupations',
          'ownerProfile',
          'ownerProfile.user',
          'addresses',
          'profilePicture',
          'bannerPicture',
          'employees',
          'employees.profile',
          'employees.profile.personalCards',
        ],
      })
      .catch(async error => {
        await this.eventBus.publish(
          new ErrorCustomEvent({
            error: error.message,
            handler: 'GetCompanyDiscoveryQueryHandler',
            localisation: 'companyRepository.find',
          }),
        );
        throw error;
      });

    if (query.userX && query.userY && query.distance) {
      company = this.getCompaniesWithinDistance(company, query.userX, query.userY, query.distance);
    }

    if (query.occupationIdList) {
      if (query.occupationIdList.length === 0) {
        return company;
      }

      company = company.filter(company => {
        return company.occupations.some(occupation => query.occupationIdList.includes(occupation.id));
      });
    }

    return company;
  }

  getCompaniesWithinDistance(
    companies: CompanyEntity[],
    userX: string,
    userY: string,
    distance: number,
  ): CompanyEntity[] {
    return companies.filter((company: CompanyEntity) => {
      const lat1 = Number(company.addresses[0].latitude);
      const lon1 = Number(company.addresses[0].longitude);
      const lat2 = Number(userY);
      const lon2 = Number(userX);

      const dLat = this.toRadians(lat2 - lat1);
      const dLon = this.toRadians(lon2 - lon1);
      const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(this.toRadians(lat1)) * Math.cos(this.toRadians(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      const distanceInMeters = this.EARTH_RADIUS * c;

      return distanceInMeters <= distance;
    });
  }

  private toRadians(degrees: number): number {
    return (degrees * Math.PI) / 180;
  }
}
