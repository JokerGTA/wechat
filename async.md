# <center><font face="楷体"> 异步多线程</font></center>  

#### 进程
###### 计算机概念，程序在服务器或操作系统中运行时占据全部计算资源总合（包括：cpu、内存、网络、磁盘、gpu等）;
###### 一个进程会包含多个线程，一般最少拥有一个线程，称为主线程;

#### 线程
###### 计算机概念，进程在响应操作时的最小单位，也包括cpu等资源线程隶属于某个进程，进程销毁时线程跟着销毁;

#### 可以多线程的原因
###### 1、多个CUP内核可以并行工作，现代IntelCPU的每个核通常支持2个线程（虚拟核），而OracleT4 CPU的每个核支持8个线程;  

###### 2、在多核处理器出现之前，大多数计算机系统只有单核处理器。CPU 调度器通过快速切换系统内的进程，以便允许每个进程取得进展，从而提供并行假象。这些进程并发运行，而非并行运行。  

##### ps：注意这里讨论的并行性和并发性的区别。并行系统可以同时执行多个任务。相比之下，并发系统支持多个任务，允许所有任务都能取得进展。因此，没有并行，并发也是可能的。

###### 考虑一个应用，它有 4 个线程。对于单核系统，并发仅仅意味着线程随着时间推移交错执行（图 1），因为处理核只能同一时间执行单个线程。  

![image](http://c.biancheng.net/uploads/allimg/181105/2-1Q105094F0934.gif)  
　　　　　　　　　　　　　　　　　图 1 单核系统上的并发执行
  
###### 对于多核系统，并发表示线程能够并行运行，因为系统可以为每个核分配一个单独线程（图 2）。 　　

![image](http://c.biancheng.net/uploads/allimg/181105/2-1Q105094H1E3.gif)  
　　　　　　　　　　　　图 2 多核系统上的并行执行

###### 3、CUP分片，1s的处理能力分成若干份，系统调度去响应不同的任务，从宏观角度看，感觉是多个任务在并行执行，从微观角度说，一个cup同一时刻只能为一个线程/任务服务；

#### 句柄
###### 数字标识，是操作系统标识某个应用程序或者应用程序中的某个组件对象，也可以称为窗体ID;

#### 多线程的优缺点
##### 优点：
###### 1、提高用户体验（winform 线程堵塞卡顿）
###### 2、程序执行速度快
##### 缺点：
###### 1、使开发测试工作变得困难
###### 多核系统趋势继续迫使系统设计人员和应用程序开发人员更好地使用多个计算核（程序设计的颠覆）;
###### 当一个程序并行运行于多核时，许多不同的执行路径是可能的。测试与调试这样的并发程序比测试和调试单线程的应用程序自然更加困难（与普通人的思维方式有出入）;
###### 2、多线程的滥用会给操作系统带来额外的负担； 
#### 同步方法
###### 发起调用，等待完成后才继续执行下一行;

#### 异步方法
###### 发起调用，不等待完成继续执行下一行，启动一个新线程完成异步方法的执行；用资源换性能（cpu利用率换执行时间）;  
###### ps：  
###### 1、cpu的资源足有限的，所以多线程的性能也是有上限的：
###### 2、资源调度也是有损耗的（分配管理多线程也会占用cpu资源）
###### 3、启动无序：线程资源是向操作系统申请的，由操作系统调度策略决定，是非托管资源我们看不到，所以启动顺序随机；
###### 4、结束无序：同一个任务同一个线程，执行时间不确定，cpu分片，不能保证cpu对其服务的时间;

#### 应用场景的选择

##### 一个订单表查询能不能用多线程优化下？
###### 答：不能。
###### 解：因为这是一个操作没办法并行;多个任务可以并行才适合用多线程；
###### 线程不是越多越好，因为cpu资源有限，而且存在调度损耗;

#####  发送充值成功的短信和邮件通知能不能用多线程优化下？
###### 答：能。
###### 解：因为这是两个独立的耗时操作，彼此没有依赖关系可以并行;  

#### 程序中的异步多线程
###### 异步是目的，而多线程是实现这个目的的方法。异步是说，A发起一个操作后（一般都是比较耗时的操作，如果不耗时的操作就没有必要异步了），可以继续自顾自的处理它自己的事儿，不用干等着这个耗时操作返回，达到避免调用线程阻塞的目的。

#### 代码实现
#### 1、异步委托
##### 基础执行
```
public void DoSomeThing(string input){} // 定义一个包含需要一个string类型参数无返回值的方法
Action<string>　action=DoSomeThing; // 实例化一个action委托
action.BeginInvoke("方法参数",null,null); // 异步执行方法DoSomeThing
```
##### 进阶-调用回调函数
```
public void DoSomeThing(string input){} // 定义一个包含需要一个string类型参数无返回值的方法
Action<string>　action=DoSomeThing; // 实例化一个action委托
AsyncCallback callBack = (ar)=>{ Console.WriteLine("开始执行回调方法"); }; // 定义异步回调函数
IAsyncResult resulta = action.BeginInvoke("方法参数", callBack, null); //异步执行方法DoSomeThing完毕后执行callBack
```
##### 进阶-调用带参数的回调函数
```
class Program
    {
        public string Name { get; set; }
        public string FoodName { get; set; }
        public string Restaurant { get; set; }

        static void Main(string[] args)
        { 
           
            Action<string, string> FoodAction = new Action<string, string>(Food);
            //第一个是AsyncCallback委托是异步完成的回调方法。第二个是用户自定义对象，该对象将传递到回调方法中。
            //BeginInvoke返回IAsyncResult接口，可用于检测异步调用的过程。

            AsyncCallback call = new AsyncCallback(Food2);
            Program pro = new Program();
            pro.FoodName = "红烧茄子";
            pro.Restaurant = "六麻子饭店";
            FoodAction.BeginInvoke("鱼香肉丝","张三餐馆" ,call, pro);
            Console.WriteLine("王四也来吃饭了");
            Console.ReadKey();
        }
        public static void Food(string foodName, string restaurant)
        {
            Thread.Sleep(1000);
            Console.WriteLine("张三出去吃了{0},在{1}吃的饭", foodName, restaurant);
        }
     
        public static void Food2(IAsyncResult ar)
        {
            Program pro = (Program)ar.AsyncState;
            //Thread.Sleep(1000);
            Console.WriteLine("六麻子出去吃了{0},在{1}吃的饭",pro.FoodName,pro.Restaurant);
        }
    }

运行后生成顺序：
王四也来吃饭了
张三出去吃了鱼香肉丝,在张三餐馆吃的饭
六麻子出去吃了红烧茄子,在六麻子饭店吃的饭
```
##### .Net Core平台不再支持这种异步方式
````
System.PlatformNotSupportedException:“Operation is not supported on this platform.”
````
#### 2、Thread
##### 主线程
每一个Windows进程都恰好包含一个用作程序入口点的主线程。进程的入口点创建的第一个线程被称为主线程。.Net执行程序（控制台、Windows Form、Wpf等）使用Main()方法作为程序入口点。当调用该方法时，主线程被创建。
##### 工作者线程
由主线程创建的线程，可以称为工作者线程，用来去执行某项具体的任务。
##### 前台线程
默认情况下，使用Thread.Start()方法创建的线程都是前台线程。  
前台线程能阻止应用程序的终结，只有所有的前台线程执行完毕，CLR
才能关闭应用程序（即卸载承载的应用程序域）。前台线程也属于工作者线程。

##### 后台线程
后台线程不会影响应用程序的终结，当所有前台线程执行完毕后，  
后台线程无论是否执行完毕，都会被终结。后台线程也属于工作者线程。

##### 使用
```
Thread thread = new Thread(TConsoleWrite);//记得要在new 创建的时候带上需要执行的方法名
thread.IsBackground = true;//这个是把我们这个线程放到后台线程里面执行
thread.Start();//Start就代表开始执行线程

static void TConsoleWrite()
    {
        //被执行的线程内的方法输出
        System.Console.WriteLine("线程一输出");
    }
```
##### 线程池ThreadPool
线程的创建是比较占用资源的一件事情，.NET为我们提供了线程池来帮助我们创建和管理线程。  
线程池是为突然大量爆发的线程设计的，通过有限的几个固定线程为大量的操作服务，减少了创建和销毁线程所需的时间，从而提高效率，这也是线程池的主要好处。  
ThreadPool适用于并发运行若干个任务且运行时间不长且互不干扰的场景。
还有一点需要注意，通过线程池创建的任务是后台任务。
```
static void Main() {
    Console.WriteLine("我是主线程：Thread Id {0}", Thread.CurrentThread.ManagedThreadId);
    ThreadPool.QueueUserWorkItem(Go);
 
    Console.ReadLine();
}
 
public static void Go(object data) {
    Console.WriteLine("我是另一个线程:Thread Id {0}",Thread.CurrentThread.ManagedThreadId);
}
```
#### 3、Async Task
##### Task
.Net 4.0引入了System.Threading.Tasks，简化了我们进行异步编程的方式，而不用直接与线程和线程池打交道。  
创建Thread的实例之后，需要手动调用它的Start方法将其启动。但是对于Task来说，StartNew和Run的同时，既会创建新的线程，并且会立即启动它。  
Task是默认会直接使用线程池，但是Thread不会。
##### Task可以有返回值
```
static void Main() {
    // GetDayOfThisWeek 运行在另外一个线程中
    var dayName = Task.Run<string>(() => { return GetDayOfThisWeek(); });
    Console.WriteLine("今天是：{0}",dayName.Result);
}
public static string GetDayOfThisWeek() {
     return DateTime.Now.DayOfWeek.ToString();
}
```
但是如果在ASP.NETCore的webapi中使用result方法来获取task输出值，会造成当前API线程阻塞等待到task执行完成后再继续进行。

##### async & await
C# async关键字用来指定某个方法、Lambda表达式或匿名方法自动以异步的方式来调用。
async/await是用来进行异步调用的形式，内部其实还是采用线程池进行管理。
如果使用await，在调用 await taskcall() 时不会阻塞get主方法线程，主方法线程会被释放，新的线程执行完成task后继续执行await后的代码减少线程切换开销，而之前的线程则空闲了。
```
[Route("api/[controller]")]
    public class ValuesController : Controller
    {
        // GET: api/<controller>
        [HttpGet("get")]
        public async Task<string> Get()
        {
            var info = string.Format("api执行线程:{0}", Thread.CurrentThread.ManagedThreadId);
            var infoTask = await TaskCaller();//使用await

            var infoTaskFinished = string.Format("api执行线程（task调用完成后）:{0}", Thread.CurrentThread.ManagedThreadId);
            return string.Format("{0},{1},{2}", info, infoTask, infoTaskFinished);
        }

        private async Task<string> TaskCaller()
        {
            await Task.Delay(5000);
            return string.Format("task 执行线程:{0}", Thread.CurrentThread.ManagedThreadId);
        }
    }
```
###### 执行顺序
api执行线程:10  
task执行线程:8  
api执行线程（a调用完成后）:8  

await前后的代码被分成块，将await的task交给线程池，线程池执行完毕之后进行moveNext方法，继续执行await之后的代码。

###### Task.result 与 await关键字 具有类似的功能可以获取到任务的返回值，但是本质上Task.result会让外层函数执行线程阻塞直到任务执行完成，而使用await关键字外层函数线程则不会阻塞，而是通过任务执行线程来执行await后的代码

##### async和await优点
以ASP.NET MVC为例，如果不采用async的Action，那么它是在一个Woker线程中执行的。当我们访问一些web service，或者读文件的时候，这个Worker线程就会被阻塞。

用async/await可以在我们访问web service的时候把当前的worker线程放走，将它放回线程池，这样它就可以去处理其它的请求了。等到web service给我们返回结果了，会再到线程池中随机拿一个新的woker线程继续往下执行。也就是说我们减少了那一部分等待的时间，充份利用了线程。




