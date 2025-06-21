import moment from "moment";

const dateFormatter = {
    monthDayTime(date) {
        let formattedDate = " ";
        if (date) {
            const monthDay = new Date(date).toString().split(" ").slice(1, 3).join(" ");
            const time = new Date(date).toString().split(" ").slice(4, 5).join(" ").slice(0, 5);

            const isTodaysDate = new Date(Date.now()).getDate() === new Date(date).getDate() ? true : false;
            formattedDate = `${isTodaysDate ? 'Today' :  monthDay}, ${time}`;
        }
        return formattedDate;
    },

    monthDayYear(date) {
        let formattedDate = " ";
        if (date) {
            const monthDay = new Date(date).toString().split(" ").slice(1, 3).join(" ");
            const year = new Date(date).getFullYear();

            formattedDate = `${monthDay}, ${year}`;
        }
        return formattedDate;
    },

    normalDate(date) {
        return moment.parseZone(
            new Date(date).toLocaleDateString(),
            "YYYY MM DD HH ZZ"
          )._i;
    },
    relativeDate(date) {
        return moment(date).fromNow();
    },
    getISOStringGMT(date) {
        const getDateByDay = new Date(date).getDate()
        const getDateByMonth = new Date(date).getMonth()+1
        const getDatebyYear  = new Date(date).getFullYear()
        const getCorrectDate = `${getDatebyYear  }-${getDateByMonth < 10 ? '0'+ getDateByMonth : getDateByMonth }-${ getDateByDay < 10 ? '0'+ getDateByDay : getDateByDay }`
        const getTimeZonebyHours =  new Date(date).getHours()
        const getTimeZonebyminute =  new Date(date).getMinutes()
        const getTimeZonebySeconds =  new Date(date).getSeconds()
        const getCorrectTime = `${getTimeZonebyHours < 10 ? '0'+ (getTimeZonebyHours + 1) : (getTimeZonebyHours + 1)  }:${getTimeZonebyminute < 10 ? '0'+ getTimeZonebyminute : getTimeZonebyminute }:${getTimeZonebySeconds < 10 ? '0'+getTimeZonebySeconds : getTimeZonebySeconds  }`
        return  new Date(getCorrectDate).toISOString().split('T')[0]+'T'+getCorrectTime
    },
    getTime (date) {
        return new Date(date).toLocaleTimeString('en', {
            timeStyle: 'short', hour12: false, timeZone: 'UTC'
        })
    }
}

export default dateFormatter;