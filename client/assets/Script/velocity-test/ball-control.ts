

const {ccclass, property} = cc._decorator;

const MOVE_LEFT = 1;
const MOVE_RIGHT = 2;

@ccclass
export default class NewClass extends cc.Component {

    @property(cc.RigidBody)
    rigidBody: cc.RigidBody = null;
    @property(Number)
    maxSpeed: number = 500;
    @property(Number)
    acceleration: number = 120;
    @property(cc.PhysicsBoxCollider)
    body: cc.PhysicsBoxCollider = null;
    @property(cc.Label)
    forceLbl: cc.Label = null;

    _moveFlags: number = 0;

    onLoad () {
        //cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_UP, this.onKeyDown, this);
    }

    start () {
        console.log("质量： " + this.rigidBody.getMass().toFixed(2));
    }

    /**
     *  f = m * v / t
     * @param dt
     */
    applyForce2 (dt) {
        let vel = this.rigidBody.linearVelocity;
        let desiredVel = 0;
        switch (this._moveFlags) {
            case MOVE_LEFT:
                desiredVel = -5;
                break;
            case MOVE_RIGHT:
                desiredVel = 5;
                break;
        }

        let velChange = desiredVel - vel.mag();
        let force = this.rigidBody.getMass() * velChange / (1/60);
        this.rigidBody.applyForce(cc.v2(force,0),this.rigidBody.getWorldCenter(),true);
    }

    /**
     * 使用冲量
     */
    applyLinearImpulse (dt) {
        let vel = this.rigidBody.linearVelocity;
        let f =  this.acceleration;
        let speed = +vel.mag().toFixed(2);
        let desiredVel = 0;
        switch (this._moveFlags) {
            case MOVE_LEFT:
                desiredVel = Math.max(speed - f,-this.maxSpeed) ;
                break;
            case MOVE_RIGHT:
                desiredVel = Math.min( speed + f, this.maxSpeed) ;
                break;
        }

        let velChange = desiredVel - vel.mag();
        let impulse = this.rigidBody.getMass() * velChange ;
        this.rigidBody.applyLinearImpulse(cc.v2(impulse,0),this.rigidBody.getWorldCenter(),true);
        this.printInfo();
    }

    /**
     *  F(力) = m (物体的质量) * a (加速度) 1N = 1 kg * m/s²
     *  速度的单位 米/每秒 （m/s）  与 像素 之间的转换关系  像素/帧（px/f)
     *  1米=30像素  1秒=60帧
     *
     *  假如要通过作用力使刚体以加速度为 a px/f² 运动的话计算公式为：
     *      F = m * a * fps * fps / 30;
     */
    applyForce (dt) {
        var speed = this.rigidBody.linearVelocity;
        let force: cc.Vec2 = cc.v2();

        let f = this.rigidBody.getMass() * this.acceleration * 60 * 60 / 30;

        if(this._moveFlags === MOVE_LEFT) {
            // speed.x -= this.acceleration * dt;
            // if(speed.x < -this.maxSpeed) {
            //     speed.x = -this.maxSpeed;
            // }
            force.x = -f;
            // if (speed.x < -this.maxSpeed) {
            //     force.x = 0;
            // }
        }
        else if (this._moveFlags === MOVE_RIGHT) {

            // if(this.node.scaleX < 0) {
            //     this.node.scaleX *= -1;
            // }
            force.x += f;
            // if(speed.x > this.maxSpeed) {
            //     f.x = 0;
            // }
        }

        this.forceLbl.string = '力：' + force.x.toFixed(2) + '速度：' + this.rigidBody.linearVelocity.mag().toFixed(2);
        this.rigidBody.applyForce(force,this.rigidBody.getWorldCenter(),true);
    }

    printInfo () {
        this.forceLbl.string =  '速度：' + this.rigidBody.linearVelocity.mag().toFixed(2);
    }

    useLinearVelocity (dt) {
        let vel = this.rigidBody.linearVelocity;
        switch (this._moveFlags) {
            case MOVE_LEFT:
                vel.x = -5;
                break;
            case MOVE_RIGHT:
                vel.x = 5;
                break;
        }

        this.rigidBody.linearVelocity = vel;
    }

    onKeyDown (event) {
        switch(event.keyCode) {
            case cc.KEY.a:
            case cc.KEY.left:
                this._moveFlags = MOVE_LEFT;
                break;
            case cc.KEY.d:
            case cc.KEY.right:
                this._moveFlags = MOVE_RIGHT;
                break;
            case cc.KEY.up:
                if (!this._upPressed) {
                    this._up = true;
                }
                this._upPressed = true;
                break;
        }
    }

    onKeyUp (event) {
        switch(event.keyCode) {
            case cc.KEY.a:
            case cc.KEY.left:
                this._moveFlags &= ~MOVE_LEFT;
                break;
            case cc.KEY.d:
            case cc.KEY.right:
                this._moveFlags &= ~MOVE_RIGHT;
                break;
            case cc.KEY.up:
                this._upPressed = false;
                break;
        }
    }

    update (dt) {
        this.applyForce(dt);
        //this.useLinearVelocity(dt);
        //this.applyForce2(dt);
        // this.applyLinearImpulse(dt);
    }
}
