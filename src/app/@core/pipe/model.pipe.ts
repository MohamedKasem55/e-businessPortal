import {Pipe, PipeTransform} from '@angular/core';
import {ModelAndListService} from "../service/base/modelAndList.service";

@Pipe({
  name: 'model'
})
export class ModelPipe implements PipeTransform {
  constructor(private modelService: ModelAndListService) {
  }

  value: string = ""

  transform(key: any, modelName: string): string {
    this.modelService.getModel(modelName).subscribe({
      next: (res) => {
        this.value = res[modelName][key]
        return this.value;
      },
      error: () => {
        return this.value;
      }
    })
    return this.value;
  }

}
