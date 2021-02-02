import { SelectorService } from '../../services/selector/selector-service';
import  actionEvents  from '../../constants/action-events';
import { EventModel } from '../../models/event-model';
import componentName  from '../../constants/component-name';
import  elementsTagName  from '../../constants/elements-tagName';
import { ElementFinderService } from '../../services/finder/element-finder-service';
import { ComponentModel } from '../../models/component-model';

/**
 * Composant qui permet de gérer les input calendar
 */
export class InputCalendarComponent {

  /** Attribut class d'un HTMLElement */
  private static  _CLASS_ATTRIBUTE = 'class';

  /** Attribut data-value du K_Selected Day */
  private static readonly _K_SELECTED_DAY_VALUE_ATTRIBUTE = 'data-value';

  /** Valeur de class du le K Calendar Header */
  private static readonly _K_CALENDAR_HEADER_CLASS = 'k-header';

  /** Valeur de class du le K Calendar Header */
  private static readonly _K_CALENDAR_VIEW_CLASS = 'k-calendar-view';

  /** Valeur de la classe du K Calendar */
  private static readonly _K_CALENDAR_CLASS = 'k-widget k-calendar';

  /**
   * Verifie si c'est un input calendar ou un date element
   * et retourne le composant associé
   */
  public static isInputCalendar(element : HTMLElement) : ComponentModel {

    // Si c'est le calendrier et qu'il a une value et un élément date
    if (this._getCalendar(element) && this._getCalendarValue(element) || this._getDateElement(element)) {
      return {component : componentName.DATECALENDAR, element};
    }

    return null;
  }

  /**
   * Edit le event model pour l'élément date
   */
  public static editDateMessage(event : EventModel, component : ComponentModel) : EventModel {

    const calendarValue = this._getCalendarValue(component.element);
    const calendar = this._getCalendar(component.element);

    // Si c'est un calendrier alors on modifie l'event en conséquence
    if (calendarValue && calendar) {
      event.action = actionEvents.CLICK_INPUT_CALENDAR;
      event.value = calendarValue.getAttribute(this._K_SELECTED_DAY_VALUE_ATTRIBUTE);

      const calendarHeaderElement = this._getCalendarHeader(calendar as HTMLElement);
      event.calendarHeader =  calendarHeaderElement ? SelectorService.find(calendarHeaderElement as HTMLElement) : '';

      const calendarPreview = this._getCalendarPreview(component.element);
      event.calendarView = calendarPreview ? SelectorService.find(calendarPreview as HTMLElement) : '';
      return event;

    }

    const elementDate = this._getDateElement(component.element);

    // Si c'est un date element
    if (elementDate) {

      event.action = actionEvents.CLICK_DATE_ELEMENT;
      event.dateSelector = SelectorService.find(elementDate as HTMLElement);

      return event;
    }

    return null;
  }

  /**
   * Récupère l'element du calendrier
   */
  private static _getCalendar(element : HTMLElement) : Element {
    return ElementFinderService.findParentElementWithTagNameAndValueAttribute(
      element,
      elementsTagName.DIVISION.toUpperCase(),
      this._CLASS_ATTRIBUTE,
      this._K_CALENDAR_CLASS,
      15
    );
  }

  /**
   * Récupère la value du calendar
   */
  private static _getCalendarValue(element : HTMLElement) : Element {
    return ElementFinderService.findParentElementWithTagNameAndAttribute(
      element,
      elementsTagName.LINK.toUpperCase(),
      this._K_SELECTED_DAY_VALUE_ATTRIBUTE,
       3
    );
  }

  /**
   * Récupère la view du calendar
   */
  private static _getCalendarPreview(element : HTMLElement) : Element {
    return ElementFinderService.findParentElementWithTagNameAndValueAttribute(
      element,
      elementsTagName.DIVISION.toUpperCase(),
      this._CLASS_ATTRIBUTE,
      this._K_CALENDAR_VIEW_CLASS,
      10
    );
  }

  /**
   * Récupère le header du calendar
   */
  private static _getCalendarHeader(element : HTMLElement) : Element {
    return ElementFinderService.findElementChildWithSelector(element, `.${this._K_CALENDAR_HEADER_CLASS}`);
  }

  /**
   * Récupère l'élement date de départ
   */
  private static _getDateElement(element : HTMLElement) : Element {
    return ElementFinderService.findParentElementWithTagName(
      element,
      elementsTagName.DATE.toUpperCase(),
      8
    );
  }

}