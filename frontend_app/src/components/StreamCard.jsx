import React, { useState } from "react";
import PropTypes from "prop-types";
import { Card, Avatar } from "antd";
import {
  DollarOutlined,
  EllipsisOutlined,
  InfoCircleOutlined,
} from "@ant-design/icons";
import { LOCK_ADDRESS } from "./Discover/util";
import { Modal, Button } from "antd";

const { Meta } = Card;

const defaultImage =
  "https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png";
function StreamCard({ data }) {
  const [isModalVisible, setIsModalVisible] = useState(false);

  const onClick = () => {
    console.log("purchase")
    // TODO: show purchase popup
  };
  const viewInfo = () => {
    setIsModalVisible(true);
  };
  const handleOk = () => setIsModalVisible(false);
  return (
    <Card
      style={{ cursor: "pointer", margin: "10px" }}
      className="ant-card"
      cover={
        <img
          alt="example"
          className="card-image"
          src={data.img || defaultImage}
        />
      }
      actions={[
        <DollarOutlined key="purchase" onClick={onClick} />,
        <InfoCircleOutlined key="info" onClick={viewInfo} />,
        // <EllipsisOutlined key="ellipsis" />,
      ]}
    >
      <Meta
        avatar={
          <Avatar src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" />
        }
        title={data.userName}
        description={`${data.title}. Purchase or preview this stream.`}
      />
      <Modal title={data.title} visible={isModalVisible} onOk={handleOk}>
        <h4>{data.userName}</h4>
        <p>
          This stream was recorded on {data.createdAt.toLocaleDateString()}.
        </p>
        <p>
          Purchasing this item grants you the right to share, repost, and
          download the original recording.
        </p>
      </Modal>
    </Card>
  );
}

StreamCard.propTypes = {};

export default StreamCard;
