

export class Endpoints {
  public static readonly SERVICE_ENDPOINT ='http://localhost:80/api'//'https://test.cloudsd.it/provaGits/public/index.php/api';////'https://saccucci-testing.herokuapp.com'; //

  public static readonly COURSE_PRINCIPAL_ROUTE = Endpoints.SERVICE_ENDPOINT + '/courses';
  public static readonly USER_PRINCIPAL_ROUTE = Endpoints.SERVICE_ENDPOINT + '/user';

  /** Course backend*/

  public static readonly NEW_COURSE = Endpoints.COURSE_PRINCIPAL_ROUTE + '/new/';
  public static readonly LIST_COURSE = Endpoints.COURSE_PRINCIPAL_ROUTE + '/getCourses';
  public static readonly DELETE_COURSE = Endpoints.COURSE_PRINCIPAL_ROUTE + '/delete/';
  public static readonly GET_COURSE_ID = Endpoints.COURSE_PRINCIPAL_ROUTE + '/getCourse/';


  public static readonly ADD_PRESENZA = Endpoints.COURSE_PRINCIPAL_ROUTE + '/addPresenza';
  public static readonly DELETE_PRESENZA = Endpoints.COURSE_PRINCIPAL_ROUTE + '/deletePresenza/';
  public static readonly ADD_PRESENZA_LIST_USER = Endpoints.COURSE_PRINCIPAL_ROUTE + '/addPresenzeListUser';
  public static readonly FIND_PRESENZE_TODAY = Endpoints.COURSE_PRINCIPAL_ROUTE + '/findPresenzeDay/';

  public static readonly EXPORT_PRESENZE = Endpoints.COURSE_PRINCIPAL_ROUTE + '/exportToPdfByCourseId/';

  public static readonly GET_ALL_USER = Endpoints.USER_PRINCIPAL_ROUTE + '/getAll';
  public static readonly FIND_BY_MAIL = Endpoints.USER_PRINCIPAL_ROUTE + '/findByMail/';
  public static readonly FIND_BY_COURSE = Endpoints.USER_PRINCIPAL_ROUTE + '/findByCourse/';

  public static readonly DELETE_USER = Endpoints.USER_PRINCIPAL_ROUTE + '/deleteUser/';


  /** TASSE */
  public static readonly GET_TASSE = Endpoints.COURSE_PRINCIPAL_ROUTE + '/getCorsiTasse';
  public static readonly ADD_TASSE = Endpoints.COURSE_PRINCIPAL_ROUTE + '/addTasse';
}
