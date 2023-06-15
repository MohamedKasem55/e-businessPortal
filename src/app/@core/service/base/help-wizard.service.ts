import {Injectable} from "@angular/core";
import {Observable, Subject} from "rxjs";

@Injectable({
  providedIn:"root"
})
export class HelpWizardService {


  public static onHelpWizardStartedSubject: Subject<boolean> = new Subject<boolean>();
  private onHelpWizardDashboardSubject: Subject<null> = new Subject<null>();
  private onHelpWizardDashboardLayoutResumeSubject: Subject<null> = new Subject<null>();

  startHelpWizardOnDashBoard() {
    this.onHelpWizardDashboardSubject.next(null);
  }

  onStartHelpWizardOnDashBoard(): Observable<null> {
    return this.onHelpWizardDashboardSubject.asObservable();
  }


  resumeHelpWizardOnDashBoardLayout() {
    this.onHelpWizardDashboardLayoutResumeSubject.next(null);
  }

  onResumeHelpWizardOnDashBoardLayout(): Observable<null> {
    return this.onHelpWizardDashboardLayoutResumeSubject.asObservable();
  }




}
