$(function () {
    //assign Luxon shortcut variable:
    var DateTime = luxon.DateTime;

    //assign target shipping times:
    var morningTarget = 10;
    var afternoonTarget = 16;

    var todayDate;
    var cutoffTime;
    var deliveryText;

    //Function to get the current time and set the current shipping cutoff time.
    var getTime = function () {
        //get current time in chosen timezone using Luxon; get day of the week and the hour.
        var now = DateTime.local().setZone('America/Los_Angeles');
        var weekday = now.weekday;
        var weekdayName = now.weekdayLong;
        var day = now.day;
        var hour = now.hour;
        //get today's date
        todayDate = now.day;

        console.log('Time now: ', now);

        //Monday-Thursday
        if (weekday >= 1 && weekday <= 4) {

            //Between morningTarget & afternoonTarget, countdown to afternoon
            if (hour >= morningTarget && hour < afternoonTarget) {
                console.log(weekdayName + ' ' + morningTarget + ':00 to ' + afternoonTarget + ':00');
                //Set the shipping cutoff time using Luxon:
                var setCutoff = DateTime.fromObject({ hour: afternoonTarget, zone: 'America/Los_Angeles' });
                //Convert the shipping cutoff time to a JS date object that is used by the countdown timer plugin:
                cutoffTime = setCutoff.toJSDate();
                //Set our shipping message for the user:
                deliveryText = 'by 10am the next business day';
            }

            //AfternoonTarget - 11:59pm, countdown until morning next day
            else if (hour >= afternoonTarget && hour < 24) {
                //missed deadline today, add one day
                console.log(weekdayName + ' ' + afternoonTarget + ':00 - ' + '23:59 '+ 'Missed deadline today');
                var setCutoff = DateTime.fromObject({ day: day +1, hour: morningTarget, zone: 'America/Los_Angeles' });
                cutoffTime = setCutoff.toJSDate();
                deliveryText = 'by 10am the next business day';
            }

            //Midnight - morningTarget, countdown to morning today
            else {
                console.log(weekdayName + ' 00:00 to ' + morningTarget + ':00');
                var setCutoff = DateTime.fromObject({ hour: morningTarget, zone: 'America/Los_Angeles' });
                cutoffTime = setCutoff.toJSDate();
                deliveryText = 'today';
            }
        }

        //Friday
        else if (weekday === 5) {
          //Between morningTarget & afternoonTarget, countdown to afternoon
          if (hour >= morningTarget && hour < afternoonTarget) {
              console.log('Friday ' + morningTarget + ':00 to ' + afternoonTarget + ':00');
              var setCutoff = DateTime.fromObject({ hour: afternoonTarget, zone: 'America/Los_Angeles' });
              cutoffTime = setCutoff.toJSDate();
              deliveryText = 'by 10am the next business day';
          }

          //AfternoonTarget - 11:59pm, countdown until Monday
          else if (hour >= afternoonTarget && hour < 24) {
              //missed deadline today, add 3 days
              console.log('Friday ' + afternoonTarget + ':00 - ' + '23:59 ');
              var setCutoff = DateTime.fromObject({ day: day +3, hour: morningTarget, zone: 'America/Los_Angeles' });
              cutoffTime = setCutoff.toJSDate();
              deliveryText = 'by 10am the next business day';
          }

          //Midnight - morningTarget, countdown to morning today
          else {
              console.log('Friday 00:00 to ' + morningTarget + ':00');
              var setCutoff = DateTime.fromObject({ hour: morningTarget, zone: 'America/Los_Angeles' });
              cutoffTime = setCutoff.toJSDate();
              deliveryText = 'today';
          }
        }

        //Saturday
        else if (weekday === 6) {
          //All day countdown to Monday morning
              console.log('Saturday - Countdown to Monday ' + morningTarget + ':00');
              var setCutoff = DateTime.fromObject({ day: day +2, hour: morningTarget, zone: 'America/Los_Angeles' });
              cutoffTime = setCutoff.toJSDate();
              deliveryText = 'by 10am the next business day';
        }

        //Sunday
        else if (weekday === 0) {
          //All day countdown to Monday morning
              console.log('Sunday - Countdown to Monday ' + morningTarget + ':00');
              var setCutoff = DateTime.fromObject({ day: day +1, hour: morningTarget, zone: 'America/Los_Angeles' });
              cutoffTime = setCutoff.toJSDate();
              deliveryText = 'the next business day';
        }

        //Display the shipping cutoff time (in local timezone) and shipping message to user:
        $('#when').text(cutoffTime);
        $('#delivery').text(deliveryText);
    }

    var startTimer = function () {
        getTime();
        //Initialize the countdown timer plugin with our settings:
        $('#defaultCountdown').countdown({
            until: cutoffTime,
            format: 'HMS',
            layout: '{hnn}{sep}{mnn}{sep}{snn}',
            onExpiry: restartTimer,
            onTick: isNewDay,
            tickInterval: 3600 //in seconds
        });
    };

    var restartTimer = function () {
        console.log('restartTimer ran');
        //When timer has ended, get the new current time and shipping cutoff time, and reintiialize:
        getTime();
        $('#defaultCountdown').countdown('option', { until: cutoffTime });
    }

    var isNewDay = function() {
      //Check if the date has changed. If so, update shipping cutoff time & message
      if (todayDate !== DateTime.local().setZone('America/Los_Angeles').day ) {
        console.log('isNewDay ran');
        getTime();
      }
    }

    startTimer();
});
