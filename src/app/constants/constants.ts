export class Constants {

  public static readonly FISCAL_CODE_REGEX = '^[a-zA-Z]{6}[0-9]{2}[abcdehlmprstABCDEHLMPRST]{1}[0-9]{2}([a-zA-Z]{1}[0-9]{3})[a-zA-Z]{1}$';
  public static readonly ALPHA_REGEX_LETTERS_ACCENTED_WITH_APOSTROPH = /^[A-Za-zÀ-ÿ][A-Za-zÀ-ÿ'\s]*$/;

  public static readonly EMAIL_REGEX = "^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$";
}
