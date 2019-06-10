import angular from "angular";
import ngMaterial from "angular-material";
import ngMessages from "angular-messages";
import "angular-material/angular-material.css";
import { McDatesComponent } from "./components/mc-dates";
import moment from "moment";

angular
    .module("app", [ngMaterial, ngMessages])
    .config([
        "$mdDateLocaleProvider",
        function($mdDateLocaleProvider) {
            $mdDateLocaleProvider.formatDate = function(date: string | Date) {
                return date ? moment(date).format("DD.MM.YYYY") : "";
            };

            $mdDateLocaleProvider.parseDate = function(dateString: string) {
                var m = moment(dateString, "DD.MM.YYYY");
                return m.isValid() ? m.toDate() : "";
            };
        }
    ])
    .component("mcDates", new McDatesComponent())
    .controller("AppCtrl", function () {
        this.date1 = "2017-12-05";
        this.date2 = "2017-12-19";
        this.changeDates = () => {
            alert(`date1: ${this.date1}, date2: ${this.date2}`);
        };
    });

angular.bootstrap(document, ["app"]);
