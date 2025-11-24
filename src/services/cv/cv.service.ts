import { BaseService } from "@services/base.service";
import { Cv } from "../../types/db";
import { SuggestJobInputDto } from "@/dtos/cv/suggest-job-input.dto";

export class CvService extends BaseService {
  constructor() {
    super("/cv");
  }
  public getUserCv() {
    return this.get(`/my-cv`);
  }

  public updateCv(id: number, cv: Partial<Cv>) {
    return this.put(`/${id}`, cv);
  }
  public deleteCv(cvId: number) {
    return this.delete(`/${cvId}`);
  }
  public createCv(cv: Cv) {
    return this.post("", cv);
  }

  public getSuggestJob(suggestJobInput: SuggestJobInputDto) {
    return this.post(`/suggest-jobs`, suggestJobInput);
  }
}
export const cvService = new CvService();
