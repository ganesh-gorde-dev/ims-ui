import { NgModule } from '@angular/core';
import { LabelPipe } from './pipes/label.pipe';
import { MaterialModule } from './material.module';

@NgModule({
  imports: [LabelPipe, MaterialModule],
  exports: [LabelPipe, MaterialModule], // if using outside this module
})
export class SharedModule {}
