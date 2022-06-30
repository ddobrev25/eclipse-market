namespace Eclipse_Market
{
    public class MomentInTime
    {
        public int Day { get; set; }
        public int Hour { get; set; }
        public int Minute { get; set; }
        public int Second { get; set; }
        public MomentInTime(int day, int hour, int minute, int second)
        {
            Day = day;
            Hour = hour;
            Minute = minute;
            Second = second;
        }

        public TimeSpan ToTimeSpan()
        {
            return new TimeSpan(Day, Hour, Minute, Second);
        }
    }
}
