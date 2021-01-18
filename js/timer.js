$(function () {
    var DateTime = luxon.DateTime;
    var morningTarget = 10;
    var afternoonTarget = 16;
    var cutoffTime;
    var deliveryText;

    var getTime = function () {
        var now = DateTime.local().setZone('America/Los_Angeles');
        var weekday = now.weekday;
        var year = now.year;
        var month = now.month;
        var day = now.day;
        var hour = now.hour;

        console.log(now);

        //Monday-Thursday
        if (weekday >= 1 && weekday <= 4) {
            //$('#defaultCountdown').addClass('show');

            //Between morningTarget & afternoonTarget, countdown to afternoon
            if (hour >= morningTarget && hour < afternoonTarget) {
                console.log(morningTarget + 'am to ' + afternoonTarget + 'pm');
                var setCutoff = DateTime.fromObject({ hour: afternoonTarget, zone: 'America/Los_Angeles' });
                cutoffTime = setCutoff.toJSDate();
                deliveryText = 'by 10am the next business day';
            }

            //AfternoonTarget - 11:59pm, countdown until morning next day
            else if (hour >= afternoonTarget && hour < 24) {
                //missed deadline today, add one day
                console.log(afternoonTarget + 'pm - ' + 'Midnight '+ '-Missed deadline today');
                var setCutoff = DateTime.fromObject({ day: day +1, hour: morningTarget, zone: 'America/Los_Angeles' });
                cutoffTime = setCutoff.toJSDate();
                deliveryText = 'by 10am the next business day';
            }

            //Midnight - morningTarget, coundown to morning today
            else {
                console.log('Midnight to ' + morningTarget + 'am');
                var setCutoff = DateTime.fromObject({ hour: morningTarget, zone: 'America/Los_Angeles' });
                cutoffTime = setCutoff.toJSDate();
                deliveryText = 'today';
            }
        }

        //Friday
        else if (weekday === 5) {
          console.log('Today is Friday');
        }

        //Saturday
        else if (weekday === 6) {
          console.log('Today is Saturday');
        }

        //Sunday
        else if (weekday === 0) {
          console.log('Today is Sunday');
        }

        $('#when').text(cutoffTime);
        $('#delivery').text(deliveryText);
    }

    var startTimer = function () {
        getTime();
        $('#defaultCountdown').countdown({
            until: cutoffTime,
            format: 'HMS',
            layout: '{hnn}{sep}{mnn}{sep}{snn}',
            onExpiry: restartTimer
        });
    };

    var restartTimer = function () {
        console.log("restart ran")
        getTime();
        $('#defaultCountdown').countdown('option', { until: cutoffTime });
    }

    startTimer();

});
