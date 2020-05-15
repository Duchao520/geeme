const animation = {
    animationEvent(event, numberOfTimes, timeLong, carPosition) {
        /**
         * event点击事件(普通DOM点击event事件)
         * numberOfTimes在规定时长内运动的次数
         * timeLong运动的时长
         * carPosition:目标（购物车的位置）
         */
        let coordinateX = event.clientX; //初始基准坐标x
        let coordinateY = event.clientY; //初始基准坐标y
        let targetNode = null;
        findParentLI(event.target || event.srcElement);
        let nodeToClone = targetNode.getElementsByTagName('img')[0].cloneNode(true);

        function findParentLI(DOM) {

            if (DOM.nodeName === "LI") {
                targetNode = DOM
            }else{
                let parent = DOM.parentNode || DOM.parentElement;
                if (parent.nodeName === 'LI') {
                    targetNode = parent;
                } else {
                    findParentLI(parent)
                }
            }

        }
        nodeToClone.setAttribute('id', 'animateGoods');
        document.getElementsByTagName('body')[0].appendChild(nodeToClone);
        nodeToClone.style.position = "fixed";
        nodeToClone.style.top = coordinateY + 'px';
        nodeToClone.style.left = coordinateX + "px";
        nodeToClone.style.width = "100px";
        nodeToClone.style.height = "100px";
        nodeToClone.style.borderRadius = "50%";
        nodeToClone.style.transform = "translate(-50%, -50%)";

        let A = carPosition.x - coordinateX;
        let B = carPosition.y - coordinateY;

        /**
         * y=a*x^2 +b
         */
        let a = B / (Math.pow(A, 2));

        let spacingX = A / numberOfTimes;
        let count = 0;
        let timer = setInterval(() => {
            count++;
            if (count === numberOfTimes) {
                window.clearInterval(timer);
                let DOM = document.getElementById("animateGoods");
                let Body = document.getElementsByTagName('body')[0]
                Body.removeChild(DOM)
            }

            /**
             * y=-a*x^2向右平移A，向上平移B
             */
            let moveX = spacingX * count;
            let moveY = -a * Math.pow(moveX - A, 2) + B;
            nodeToClone.style.left = (coordinateX + moveX) + "px"
            nodeToClone.style.top = (coordinateY + moveY) + 'px';

        }, timeLong / numberOfTimes * 1000);
    }
}
export default animation;
