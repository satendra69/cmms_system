
                        <Tab
                          key={index}
                          label={
                            <div
                              className="custom-tab-content"
                              style={{
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "center",
                              }}
                            >
                              <div
                                className="custom-tab-title"
                                style={{
                                  display: "flex",
                                  alignItems: "center",
                                  gap: 4,
                                  cursor: "pointer",
                                }}
                                onMouseEnter={() =>
                                  setSelectedPie(item.TotalType)
                                }
                                onMouseLeave={() => setSelectedPie("default")}
                              >
                                <span
                                  style={{
                                    height: "10px",
                                    width: "10px",
                                    background: colors[index % colors.length], // Ensure color index is within range
                                    borderRadius: "50%",
                                  }}
                                  className="shadowBt"
                                ></span>
                                <p style={{ fontSize: "12px" }}>
                                  {item.TotalType}
                                </p>
                              </div>
                              <div
                                className="custom-tab-summary"
                                style={{
                                  marginTop: "8px",
                                  whiteSpace: "nowrap",
                                }}
                              >
                                <Typography
                                  style={{
                                    fontSize: "12px",
                                    marginTop: "-20px",
                                  }}
                                >
                                  {item.TotalSum} Work Orders
                                </Typography>
                              </div>
                            </div>
                          }
                          value={index}
                        />

                        <Tab
                          key={index}
                          label={
                            <div
                              className="custom-tab-content"
                              style={{
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "center",
                              }}
                            >
                              <div
                                className="custom-tab-title"
                                style={{
                                  display: "flex",
                                  alignItems: "center",
                                  gap: 4,
                                  cursor: "pointer",
                                }}
                                onMouseEnter={() =>
                                  setSelectedPie(item.TotalType)
                                }
                                onMouseLeave={() => setSelectedPie("default")}
                              >
                                <span
                                  style={{
                                    height: "10px",
                                    width: "10px",
                                    background: colors[index % colors.length], // Ensure color index is within range
                                    borderRadius: "50%",
                                  }}
                                  className="shadowBt"
                                ></span>
                                <p style={{ fontSize: "12px" }}>
                                  {item.TotalType}
                                </p>
                              </div>
                              <div
                                className="custom-tab-summary"
                                style={{
                                  marginTop: "8px",
                                  whiteSpace: "nowrap",
                                }}
                              >
                                <Typography
                                  style={{
                                    fontSize: "12px",
                                    marginTop: "-20px",
                                  }}
                                >
                                  {item.TotalSum} Work Orders
                                </Typography>
                              </div>
                            </div>
                          }
                          value={index}
                        />

                        <Tab
                          key={index}
                          label={
                            <div
                              className="custom-tab-content"
                              style={{
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "center",
                              }}
                            >
                              <div
                                className="custom-tab-title"
                                style={{
                                  display: "flex",
                                  alignItems: "center",
                                  gap: 4,
                                  cursor: "pointer",
                                }}
                                onMouseEnter={() =>
                                  setSelectedPie(item.TotalType)
                                }
                                onMouseLeave={() => setSelectedPie("default")}
                              >
                                <span
                                  style={{
                                    height: "10px",
                                    width: "10px",
                                    background: colors[index % colors.length], // Ensure color index is within range
                                    borderRadius: "50%",
                                  }}
                                  className="shadowBt"
                                ></span>
                                <p style={{ fontSize: "12px" }}>
                                  {item.TotalType}
                                </p>
                              </div>
                              <div
                                className="custom-tab-summary"
                                style={{
                                  marginTop: "8px",
                                  whiteSpace: "nowrap",
                                }}
                              >
                                <Typography
                                  style={{
                                    fontSize: "12px",
                                    marginTop: "-20px",
                                  }}
                                >
                                  {item.TotalSum} Work Orders
                                </Typography>
                              </div>
                            </div>
                          }
                          value={index}
                        />