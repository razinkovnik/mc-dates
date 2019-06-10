import moment from 'moment'
import template from './template.html'
import './index.css'

export class McDatesComponent implements ng.IComponentOptions {
    public controller = McDatesController;
    public template: string = template;
    public bindings: any;

    constructor() {
        this.bindings = {
            dateFrom: "=",
            dateTo: "=",
            mcChange: "&"
        }
    }
}

class McDatesController {
    public module: string;

    static $inject = ['$timeout'];
    $dateFrom: string;
    $dateTo: string;
    maxDate: Date;
    minDate: Date;
    mcChange: Function

    constructor(private $timeout: ng.ITimeoutService) {}

    get dateFrom() {
        return this.$dateFrom;
    }

    get dateTo() {
        return this.$dateTo;
    }

    set dateFrom(value) {
        this.$dateFrom = value;
        this.updateValue('$dateFrom', value);
    }

    set dateTo(value) {
        this.$dateTo = value;
        this.updateValue('$dateTo', value);
    }

    updateValue(key: string, value: string | Date | null) {
        if (value !== null) {
            this[key] =
                typeof value !== "string"
                    ? moment(value).format("YYYY-MM-DD")
                    : value;
            if (this[key] === "") this[key] = null;
        } else {
            this[key] = null
        }
        this.updateDateLimits();
    }

    updateDateLimits() {
        this.maxDate = moment(this.$dateTo, "YYYY-MM-DD").toDate();
        this.minDate = moment(this.$dateFrom, "YYYY-MM-DD").toDate();
    }

    onChange() {
        this.$timeout(() => {
            this.mcChange();
        }, 50);
    }

    setInterval(dateFrom: moment.Moment, dateTo: moment.Moment) {
        const date1 = dateFrom.format("YYYY-MM-DD");
        const date2 = dateTo.format("YYYY-MM-DD");
        if (this.$dateFrom !== date1 || this.$dateTo !== date2) {
            this.maxDate = dateTo.toDate();
            this.minDate = dateFrom.toDate();
            this.$timeout(() => {
                this.$dateFrom = date1;
                this.$dateTo = date2;
                this.onChange();
            }, 50);
        }
    }

    yesterday() {
        const date = moment().subtract(1, "days");
        this.setInterval(date, date);
    }

    today() {
        const date = moment();
        this.setInterval(date, date);
    }

    twoWeek() {
        const before = moment().subtract(14, "days");
        const today = moment();
        this.setInterval(before, today);
    }

    month() {
        const before = moment().subtract(30, "days");
        const today = moment();
        this.setInterval(before, today);
    }

    all() {
        if (this.$dateFrom !== null || this.$dateTo !== null) {
            this.$dateFrom = null;
            this.$dateTo = null;
            this.$timeout(() => this.mcChange(), 50);
        }
    }
}